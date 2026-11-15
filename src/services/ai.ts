import { calls as defaultCalls, notes as defaultNotes, reminders as defaultReminders, contacts as defaultContacts } from '../data';
import type { CallRecord, Note, Reminder, Contact, ChatMessage } from '../types';

export type AIProvider = 'local-builtin' | 'gemini' | 'ollama' | 'custom-openai';

export interface AISettings {
  provider: AIProvider;
  endpointUrl: string; // e.g. 'http://localhost:11434'
  model: string;       // e.g. 'gemini-1.5-flash', 'gemini-1.5-pro', 'llama3', 'mistral'
  apiKey?: string;     // Google Gemini API key or custom provider key
  voiceOutput: boolean;
  voiceCommands: boolean;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'local-builtin',
  endpointUrl: 'http://localhost:11434',
  model: 'llama3:latest',
  apiKey: '',
  voiceOutput: true,
  voiceCommands: true,
};

const STORAGE_KEY = 'recallcall_ai_settings';

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // Fallback if localStorage unavailable
  }
  return DEFAULT_AI_SETTINGS;
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export interface AIResponse {
  text: string;
  matchedCalls?: CallRecord[];
  matchedNotes?: Note[];
  matchedReminders?: Reminder[];
  matchedContacts?: Contact[];
  suggestedAction?: {
    type: 'create_reminder' | 'create_note' | 'call_contact';
    payload: Record<string, any>;
  };
}

/**
 * Built-in zero-dependency local semantic AI engine.
 * Runs instantly in the browser without any server, API keys, or installations.
 * Understands intents, filters calls/notes/reminders, and generates helpful summaries.
 */
export function queryBuiltinLocalAI(
  prompt: string,
  data: {
    calls?: CallRecord[];
    notes?: Note[];
    reminders?: Reminder[];
    contacts?: Contact[];
  }
): AIResponse {
  const q = prompt.toLowerCase().trim();
  const calls = data.calls ?? defaultCalls;
  const notes = data.notes ?? defaultNotes;
  const reminders = data.reminders ?? defaultReminders;
  const contacts = data.contacts ?? defaultContacts;

  // 1. Who called / missed calls / calls queries
  if (q.includes('call') || q.includes('who rang') || q.includes('spoke with') || q.includes('talked')) {
    let matched = calls;

    if (q.includes('missed')) {
      matched = matched.filter((c) => c.type === 'missed');
    } else if (q.includes('incoming') || q.includes('received')) {
      matched = matched.filter((c) => c.type === 'incoming');
    } else if (q.includes('outgoing') || q.includes('dialed') || q.includes('called')) {
      matched = matched.filter((c) => c.type === 'outgoing');
    }

    if (q.includes('yesterday')) {
      matched = matched.filter((c) => c.date.toLowerCase().includes('yesterday'));
    } else if (q.includes('today')) {
      matched = matched.filter((c) => c.date.toLowerCase().includes('today'));
    } else if (q.includes('sunday') || q.includes('friday') || q.includes('nov')) {
      matched = matched.filter((c) => 
        c.date.toLowerCase().includes('sunday') || 
        c.date.toLowerCase().includes('nov') ||
        c.date.toLowerCase().includes('friday')
      );
    }

    // Check specific contact mentions
    const matchedContact = contacts.find((ct) => q.includes(ct.name.toLowerCase().split(' ')[0]));
    if (matchedContact) {
      matched = matched.filter((c) => c.contactName.toLowerCase().includes(matchedContact.name.toLowerCase()));
    }

    if (matched.length === 0) {
      // Relax filter if empty
      matched = calls.slice(0, 2);
      return {
        text: `I couldn't find exact matches for "${prompt}", but here are your recent call logs.`,
        matchedCalls: matched,
      };
    }

    const first = matched[0];
    return {
      text: `I found ${matched.length} call${matched.length === 1 ? '' : 's'}. The most recent was with ${first.contactName} (${first.type}, ${first.date} at ${first.time}).`,
      matchedCalls: matched,
    };
  }

  // 2. Reminders queries
  if (q.includes('reminder') || q.includes('schedule') || q.includes('task') || q.includes('todo') || q.includes('standup') || q.includes('meeting')) {
    let matched = reminders;
    if (q.includes('today')) {
      matched = matched.filter((r) => r.date === 'Today');
    } else if (q.includes('upcoming') || q.includes('tomorrow')) {
      matched = matched.filter((r) => r.date !== 'Today');
    } else if (q.includes('completed')) {
      matched = matched.filter((r) => r.completed);
    }

    const pendingToday = reminders.filter((r) => r.date === 'Today' && !r.completed);
    return {
      text: `You have ${pendingToday.length} pending reminder${pendingToday.length === 1 ? '' : 's'} for today. Here is your overview:`,
      matchedReminders: matched.slice(0, 4),
    };
  }

  // 3. Notes queries / Summarization
  if (q.includes('note') || q.includes('prescrib') || q.includes('doctor') || q.includes('dr.') || q.includes('dr ') || q.includes('mehta') || q.includes('deadline') || q.includes('project') || q.includes('summarize')) {
    let matched = notes;
    if (q.includes('project') || q.includes('deadline')) {
      matched = matched.filter((n) => n.category === 'College' || n.title.toLowerCase().includes('project'));
    } else if (q.includes('prescrib') || q.includes('doctor') || q.includes('mehta') || q.includes('health') || q.includes('dr')) {
      matched = matched.filter((n) => n.category === 'Important' || n.title.toLowerCase().includes('prescription') || n.content.toLowerCase().includes('dr. mehta'));
    } else if (q.includes('gift') || q.includes('mom') || q.includes('birthday')) {
      matched = matched.filter((n) => n.title.toLowerCase().includes('mom') || n.content.toLowerCase().includes('birthday'));
    }

    if (matched.length > 0) {
      const top = matched[0];
      return {
        text: `Here is what I found in your Smart Notes: "${top.title}" — ${top.content.slice(0, 140)}...`,
        matchedNotes: matched.slice(0, 3),
      };
    }
  }

  // 4. Contact Memory lookup
  if (q.includes('who is') || q.includes('contact') || q.includes('about')) {
    const contact = contacts.find((c) =>
      q.includes(c.name.toLowerCase().split(' ')[0]) || q.includes(c.name.toLowerCase())
    );
    if (contact) {
      return {
        text: `${contact.name}: ${contact.memorySummary}. Last interaction: ${contact.lastInteraction}. Phone: ${contact.phone}.`,
        matchedContacts: [contact],
      };
    }
  }

  // 5. Default natural conversational reply with memory overview
  const totalCalls = calls.length;
  const totalNotes = notes.length;
  const pendingReminders = reminders.filter((r) => !r.completed).length;

  return {
    text: `I'm your local AI assistant running completely privately on your device. You have ${totalCalls} calls logged, ${totalNotes} smart notes saved, and ${pendingReminders} active reminders. You can ask me questions like:
• "Who called me yesterday?"
• "What are my reminders for today?"
• "Show my project notes"
• "Who is Rahul Sharma?"`,
  };
}

/**
 * Connects to a local LLM server (Ollama, LM Studio, or LocalAI) running locally.
 * Falls back automatically to the built-in local engine if Ollama is unreachable.
 */
export async function queryLocalModel(
  prompt: string,
  settings: AISettings,
  data: {
    calls?: CallRecord[];
    notes?: Note[];
    reminders?: Reminder[];
    contacts?: Contact[];
  }
): Promise<AIResponse> {
  // If set to builtin, use instant local engine
  if (settings.provider === 'local-builtin') {
    return queryBuiltinLocalAI(prompt, data);
  }

  // Build compact RAG context for the local model
  const contextSnippet = `
User Data Context:
Calls: ${(data.calls ?? defaultCalls).slice(0, 5).map(c => `${c.contactName} (${c.type}, ${c.date} ${c.time})`).join('; ')}
Notes: ${(data.notes ?? defaultNotes).slice(0, 4).map(n => `[${n.category}] ${n.title}: ${n.content.slice(0, 80)}`).join('; ')}
Reminders: ${(data.reminders ?? defaultReminders).slice(0, 5).map(r => `${r.title} (${r.date}, completed: ${r.completed})`).join('; ')}
Contacts: ${(data.contacts ?? defaultContacts).slice(0, 4).map(ct => `${ct.name}: ${ct.memorySummary}`).join('; ')}
`.trim();

  const systemMessage = `You are RecallCall AI, a privacy-first assistant for call history, smart notes, contacts, and reminders. Answer concisely, helpfully, and politely using the user's data context.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    let url = '';
    let body = '';

    if (settings.provider === 'gemini') {
      const apiKey = settings.apiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
      if (!apiKey) {
        throw new Error('Google Gemini API Key is missing. Set it in AI Settings or VITE_GEMINI_API_KEY.');
      }
      const modelName = settings.model || 'gemini-1.5-flash';
      url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      body = JSON.stringify({
        system_instruction: {
          parts: [{ text: `${systemMessage}\n\n${contextSnippet}` }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      });
    } else if (settings.provider === 'ollama') {
      url = `${settings.endpointUrl.replace(/\/$/, '')}/api/generate`;
      body = JSON.stringify({
        model: settings.model || 'llama3:latest',
        prompt: `${systemMessage}\n\n${contextSnippet}\n\nUser Question: ${prompt}\nAnswer:`,
        stream: false,
      });
    } else {
      url = `${settings.endpointUrl.replace(/\/$/, '')}/v1/chat/completions`;
      body = JSON.stringify({
        model: settings.model || 'local-model',
        messages: [
          { role: 'system', content: `${systemMessage}\n\n${contextSnippet}` },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI model responded with status ${response.status}`);
    }

    const json = await response.json();
    let text = '';
    if (settings.provider === 'gemini') {
      text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    } else if (settings.provider === 'ollama') {
      text = json.response ?? json.message?.content ?? '';
    } else {
      text = json.choices?.[0]?.message?.content ?? '';
    }

    if (text) {
      // Find any relevant matches to display structured cards alongside LLM answer
      const localMatches = queryBuiltinLocalAI(prompt, data);
      return {
        text,
        matchedCalls: localMatches.matchedCalls,
        matchedNotes: localMatches.matchedNotes,
        matchedReminders: localMatches.matchedReminders,
        matchedContacts: localMatches.matchedContacts,
      };
    }
  } catch (err: any) {
    console.warn(`Local model query failed (${err?.message}), falling back to built-in local engine.`);
  }

  // Graceful fallback to built-in local engine
  const fallback = queryBuiltinLocalAI(prompt, data);
  return {
    ...fallback,
    text: `[Local Engine] ${fallback.text}`,
  };
}

/**
 * Text-to-Speech using browser's built-in Web Speech API (free, offline, no API key).
 */
export function speakText(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any previous speech
    // Clean markdown/symbols for natural speech
    const clean = text.replace(/[*_#•\-\[\]]/g, '').slice(0, 200);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

/**
 * Stop any active text-to-speech.
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Check if Web Speech Recognition is available in current browser.
 */
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}
