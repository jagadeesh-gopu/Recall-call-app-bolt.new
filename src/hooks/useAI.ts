import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage, CallRecord, Note, Reminder, Contact } from '../types';
import { chatHistory, calls as staticCalls, notes as staticNotes, reminders as staticReminders, contacts as staticContacts } from '../data';
import {
  type AISettings,
  loadAISettings,
  saveAISettings,
  queryLocalModel,
  speakText,
  stopSpeaking,
} from '../services/ai';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export function useAI(dataOverrides?: {
  calls?: CallRecord[];
  notes?: Note[];
  reminders?: Reminder[];
  contacts?: Contact[];
}) {
  const [settings, setSettingsState] = useState<AISettings>(loadAISettings);
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const recognitionRef = useRef<any>(null);

  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveAISettings(updated);
      return updated;
    });
  }, []);

  const data = {
    calls: dataOverrides?.calls ?? staticCalls,
    notes: dataOverrides?.notes ?? staticNotes,
    reminders: dataOverrides?.reminders ?? staticReminders,
    contacts: dataOverrides?.contacts ?? staticContacts,
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `msg_u_${Date.now()}`,
        role: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setVoiceState('processing');

      try {
        const response = await queryLocalModel(text, settings, data);

        const aiMsg: ChatMessage = {
          id: `msg_a_${Date.now()}`,
          role: 'assistant',
          text: response.text,
          results: response.matchedCalls,
          notes: response.matchedNotes,
          reminders: response.matchedReminders,
          contacts: response.matchedContacts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Voice output if enabled
        if (settings.voiceOutput) {
          setVoiceState('speaking');
          speakText(response.text, () => {
            setVoiceState('idle');
          });
        } else {
          setVoiceState('idle');
        }

        return aiMsg;
      } catch (err) {
        console.error('AI query error:', err);
        const fallbackMsg: ChatMessage = {
          id: `msg_a_err_${Date.now()}`,
          role: 'assistant',
          text: "I couldn't process that locally. Please check if your local model or Ollama is running, or switch to the Built-in Local Engine.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setVoiceState('idle');
        return fallbackMsg;
      }
    },
    [settings, data]
  );

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: simulate voice prompt after brief delay
      setVoiceState('listening');
      setTimeout(() => {
        setVoiceState('processing');
        sendMessage('Who called me yesterday?');
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          sendMessage(transcript);
        } else {
          setVoiceState('idle');
        }
      };

      recognition.onerror = () => {
        setVoiceState('idle');
      };

      recognition.onend = () => {
        // Will transition to processing via sendMessage if result was fired
      };

      recognition.start();
    } catch {
      setVoiceState('idle');
    }
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    stopSpeaking();
    setVoiceState('idle');
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Helper to generate or summarize note content using the local AI
   */
  const generateSmartNote = useCallback(
    async (topic: string): Promise<{ title: string; content: string; tags: string[] }> => {
      const prompt = `Generate a concise smart note about: ${topic}`;
      const res = await queryLocalModel(prompt, settings, data);
      
      return {
        title: topic.slice(0, 40),
        content: res.text.replace(/^\[Local Engine\]\s*/, ''),
        tags: ['ai-generated', 'local-model'],
      };
    },
    [settings, data]
  );

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return {
    settings,
    updateSettings,
    messages,
    voiceState,
    sendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    clearMessages,
    generateSmartNote,
  };
}
