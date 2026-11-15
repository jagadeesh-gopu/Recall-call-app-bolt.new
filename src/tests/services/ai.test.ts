import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  queryBuiltinLocalAI,
  queryLocalModel,
  loadAISettings,
  saveAISettings,
  DEFAULT_AI_SETTINGS,
  type AISettings,
} from '../../services/ai';
import { calls, notes, reminders, contacts } from '../../data';

describe('AI Service — Local Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadAISettings returns defaults when localStorage is empty', () => {
    const s = loadAISettings();
    expect(s.provider).toBe('local-builtin');
    expect(s.endpointUrl).toBe('http://localhost:11434');
    expect(s.model).toBe('llama3:latest');
    expect(s.voiceOutput).toBe(true);
  });

  it('saveAISettings persists configuration and loadAISettings retrieves it', () => {
    const updated: AISettings = {
      provider: 'ollama',
      endpointUrl: 'http://localhost:11434',
      model: 'mistral:latest',
      voiceOutput: false,
      voiceCommands: true,
    };
    saveAISettings(updated);
    const loaded = loadAISettings();
    expect(loaded.provider).toBe('ollama');
    expect(loaded.model).toBe('mistral:latest');
    expect(loaded.voiceOutput).toBe(false);
  });
});

describe('AI Service — Built-in Local Semantic Engine', () => {
  const testData = { calls, notes, reminders, contacts };

  it('answers call history queries and matches incoming/outgoing/missed calls', () => {
    const res = queryBuiltinLocalAI('Who called me yesterday?', testData);
    expect(res.text).toContain('call');
    expect(res.matchedCalls).toBeDefined();
    expect(res.matchedCalls!.length).toBeGreaterThan(0);
  });

  it('correctly filters missed calls', () => {
    const res = queryBuiltinLocalAI('Show me missed calls', testData);
    expect(res.matchedCalls).toBeDefined();
    for (const c of res.matchedCalls!) {
      expect(c.type).toBe('missed');
    }
  });

  it('answers reminder queries and returns pending reminders', () => {
    const res = queryBuiltinLocalAI('What are my reminders for today?', testData);
    expect(res.text).toContain('reminder');
    expect(res.matchedReminders).toBeDefined();
    expect(res.matchedReminders!.length).toBeGreaterThan(0);
  });

  it('answers notes and prescription queries', () => {
    const res = queryBuiltinLocalAI('What did Dr. Mehta prescribe?', testData);
    expect(res.text.toLowerCase()).toContain('note');
    expect(res.matchedNotes).toBeDefined();
    expect(res.matchedNotes!.length).toBeGreaterThan(0);
    expect(res.matchedNotes![0].title).toContain('Dr. Mehta');
  });

  it('answers contact memory queries', () => {
    const res = queryBuiltinLocalAI('Who is Rahul Sharma?', testData);
    expect(res.text).toContain('Rahul Sharma');
    expect(res.matchedContacts).toBeDefined();
    expect(res.matchedContacts![0].name).toBe('Rahul Sharma');
  });

  it('provides a helpful general memory overview on greeting or general queries', () => {
    const res = queryBuiltinLocalAI('Hello, what can you do?', testData);
    expect(res.text).toContain('local AI');
    expect(res.text).toContain('calls logged');
  });
});

describe('AI Service — queryLocalModel fallback & integration', () => {
  it('uses built-in engine when provider is local-builtin', async () => {
    const settings: AISettings = {
      provider: 'local-builtin',
      endpointUrl: 'http://localhost:11434',
      model: 'llama3:latest',
      voiceOutput: true,
      voiceCommands: true,
    };

    const res = await queryLocalModel('Who called me today?', settings, { calls, notes, reminders, contacts });
    expect(res.text).toBeTruthy();
    expect(res.matchedCalls).toBeDefined();
  });

  it('gracefully falls back to built-in local engine if Ollama endpoint is down', async () => {
    // Mock fetch to simulate connection refused (Ollama not started yet)
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch (ECONNREFUSED)'));

    const settings: AISettings = {
      provider: 'ollama',
      endpointUrl: 'http://localhost:11434',
      model: 'llama3:latest',
      voiceOutput: true,
      voiceCommands: true,
    };

    const res = await queryLocalModel('What are my reminders?', settings, { calls, notes, reminders, contacts });
    expect(res.text).toContain('[Local Engine]');
    expect(res.matchedReminders).toBeDefined();

    global.fetch = originalFetch;
  });

  it('queries Google Gemini when provider is gemini and key is provided', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: 'Here are your recent calls from Gemini AI.' }] } },
        ],
      }),
    } as any);

    const settings: AISettings = {
      provider: 'gemini',
      endpointUrl: 'http://localhost:11434',
      model: 'gemini-1.5-flash',
      apiKey: 'test-api-key',
      voiceOutput: true,
      voiceCommands: true,
    };

    const res = await queryLocalModel('Who called yesterday?', settings, { calls, notes, reminders, contacts });
    expect(res.text).toBe('Here are your recent calls from Gemini AI.');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.anything()
    );

    global.fetch = originalFetch;
  });

  it('falls back to local engine if Gemini API call fails', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const settings: AISettings = {
      provider: 'gemini',
      endpointUrl: 'http://localhost:11434',
      model: 'gemini-1.5-flash',
      apiKey: 'bad-key',
      voiceOutput: false,
      voiceCommands: true,
    };

    const res = await queryLocalModel('Who called?', settings, { calls, notes, reminders, contacts });
    expect(res.text).toContain('[Local Engine]');

    global.fetch = originalFetch;
  });
});
