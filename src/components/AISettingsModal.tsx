import { useState } from 'react';
import { X, Sparkles, Cpu, Check, Globe, RefreshCw, Volume2, Shield, Key, ExternalLink } from 'lucide-react';
import type { AISettings, AIProvider } from '../services/ai';

interface AISettingsModalProps {
  settings: AISettings;
  onUpdate: (updated: Partial<AISettings>) => void;
  onClose: () => void;
}

export function AISettingsModal({ settings, onUpdate, onClose }: AISettingsModalProps) {
  const [provider, setProvider] = useState<AIProvider>(settings.provider);
  const [endpointUrl, setEndpointUrl] = useState(settings.endpointUrl);
  const [model, setModel] = useState(settings.model);
  const [apiKey, setApiKey] = useState(settings.apiKey ?? '');
  const [voiceOutput, setVoiceOutput] = useState(settings.voiceOutput);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = () => {
    onUpdate({
      provider,
      endpointUrl,
      model,
      apiKey,
      voiceOutput,
    });
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      if (provider === 'local-builtin') {
        setTimeout(() => setTestStatus('success'), 300);
        return;
      }

      if (provider === 'gemini') {
        const key = apiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
        if (!key) {
          setTestStatus('error');
          return;
        }
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );
        if (res.ok) {
          setTestStatus('success');
        } else {
          setTestStatus('error');
        }
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const checkUrl = provider === 'ollama' 
        ? `${endpointUrl.replace(/\/$/, '')}/api/tags`
        : `${endpointUrl.replace(/\/$/, '')}/v1/models`;

      const res = await fetch(checkUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-navy-900 rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-navy-900 dark:text-white text-base">Local AI Settings</h2>
              <p className="text-[11px] text-navy-400">Google Gemini & Local Offline AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center transition-colors hover:bg-navy-200"
          >
            <X size={16} className="text-navy-600 dark:text-navy-200" />
          </button>
        </div>

        {/* Privacy badge */}
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5">
          <Shield size={16} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-snug">
            {provider === 'gemini'
              ? 'Using Google Gemini with end-to-end HTTPS encrypted requests.'
              : 'All AI queries run 100% locally on your device with complete privacy.'}
          </p>
        </div>

        {/* Provider selection */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-semibold text-navy-600 dark:text-navy-300 block">Choose AI Provider</label>

          {/* Option 1: Built-in Local Engine */}
          <button
            onClick={() => { setProvider('local-builtin'); setTestStatus('idle'); }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              provider === 'local-builtin'
                ? 'border-lavender-400 bg-lavender-50/50 dark:bg-lavender-900/20 shadow-soft'
                : 'border-navy-100 dark:border-navy-700 bg-navy-50/50 dark:bg-navy-800/40 hover:bg-white dark:hover:bg-navy-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-navy-900 dark:text-white">Built-in Local Brain</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">Offline</span>
              </div>
              <p className="text-[11px] text-navy-400 mt-0.5">
                Zero installation needed. Smart natural-language matching for your calls, notes & reminders.
              </p>
            </div>
            {provider === 'local-builtin' && <Check size={16} className="text-lavender-500 shrink-0 mt-1" />}
          </button>

          {/* Option 2: Google Gemini (Free Tier / Pro) */}
          <button
            onClick={() => {
              setProvider('gemini');
              if (!model.startsWith('gemini')) setModel('gemini-1.5-flash');
              setTestStatus('idle');
            }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              provider === 'gemini'
                ? 'border-lavender-400 bg-lavender-50/50 dark:bg-lavender-900/20 shadow-soft'
                : 'border-navy-100 dark:border-navy-700 bg-navy-50/50 dark:bg-navy-800/40 hover:bg-white dark:hover:bg-navy-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-navy-900 dark:text-white">Google Gemini</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">Pro & Flash</span>
              </div>
              <p className="text-[11px] text-navy-400 mt-0.5">
                Fast multimodal reasoning powered by Gemini 1.5 Flash or Gemini 1.5 Pro.
              </p>
            </div>
            {provider === 'gemini' && <Check size={16} className="text-lavender-500 shrink-0 mt-1" />}
          </button>

          {/* Option 3: Ollama Local LLM */}
          <button
            onClick={() => {
              setProvider('ollama');
              if (model.startsWith('gemini')) setModel('llama3:latest');
              setTestStatus('idle');
            }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              provider === 'ollama'
                ? 'border-lavender-400 bg-lavender-50/50 dark:bg-lavender-900/20 shadow-soft'
                : 'border-navy-100 dark:border-navy-700 bg-navy-50/50 dark:bg-navy-800/40 hover:bg-white dark:hover:bg-navy-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0">
              <Cpu size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-navy-900 dark:text-white">Ollama Local Model</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">Localhost</span>
              </div>
              <p className="text-[11px] text-navy-400 mt-0.5">
                Connects to Ollama running locally (<code className="text-[10px] bg-navy-100 dark:bg-navy-700 px-1 rounded">llama3</code>, <code className="text-[10px] bg-navy-100 dark:bg-navy-700 px-1 rounded">mistral</code>, etc.).
              </p>
            </div>
            {provider === 'ollama' && <Check size={16} className="text-lavender-500 shrink-0 mt-1" />}
          </button>

          {/* Option 4: Custom OpenAI-compatible local server */}
          <button
            onClick={() => {
              setProvider('custom-openai');
              if (model.startsWith('gemini')) setModel('local-model');
              setTestStatus('idle');
            }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              provider === 'custom-openai'
                ? 'border-lavender-400 bg-lavender-50/50 dark:bg-lavender-900/20 shadow-soft'
                : 'border-navy-100 dark:border-navy-700 bg-navy-50/50 dark:bg-navy-800/40 hover:bg-white dark:hover:bg-navy-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shrink-0">
              <Globe size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-xs text-navy-900 dark:text-white">LM Studio / LocalAI / Jan</span>
              <p className="text-[11px] text-navy-400 mt-0.5">
                Any local OpenAI-compatible endpoint on your machine.
              </p>
            </div>
            {provider === 'custom-openai' && <Check size={16} className="text-lavender-500 shrink-0 mt-1" />}
          </button>
        </div>

        {/* Configuration inputs for Gemini */}
        {provider === 'gemini' && (
          <div className="space-y-3 mb-5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 animate-slide-up">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-navy-600 dark:text-navy-300 flex items-center gap-1">
                  <Key size={12} className="text-blue-500" />
                  Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  Get free key <ExternalLink size={10} />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none"
              />
              <p className="text-[10px] text-navy-400 mt-1">Free tier allows up to 15 requests/min. Never exposed publicly.</p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-navy-600 dark:text-navy-300 mb-1 block">Model Variant</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
              >
                <RefreshCw size={12} className={testStatus === 'testing' ? 'animate-spin' : ''} />
                Verify Key
              </button>
              {testStatus === 'success' && <span className="text-[11px] text-emerald-500 font-medium">Valid & Connected!</span>}
              {testStatus === 'error' && <span className="text-[11px] text-rose-500 font-medium">Invalid or missing key</span>}
            </div>
          </div>
        )}

        {/* Configuration inputs if Ollama or Custom */}
        {(provider === 'ollama' || provider === 'custom-openai') && (
          <div className="space-y-3 mb-5 p-4 rounded-2xl bg-navy-50/50 dark:bg-navy-800/30 border border-navy-100 dark:border-navy-700 animate-slide-up">
            <div>
              <label className="text-[11px] font-medium text-navy-500 dark:text-navy-400 mb-1 block">Local API Endpoint</label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-navy-500 dark:text-navy-400 mb-1 block">Model Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="llama3:latest"
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white focus:outline-none"
              />
              <p className="text-[10px] text-navy-400 mt-1">Suggested: llama3, mistral, phi3, qwen2.5</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="text-xs text-lavender-600 dark:text-lavender-400 font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
              >
                <RefreshCw size={12} className={testStatus === 'testing' ? 'animate-spin' : ''} />
                Test Connection
              </button>
              {testStatus === 'success' && <span className="text-[11px] text-emerald-500 font-medium">Connected successfully</span>}
              {testStatus === 'error' && <span className="text-[11px] text-rose-500 font-medium">Unreachable (will fallback to built-in)</span>}
            </div>
          </div>
        )}

        {/* Voice synthesis toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card mb-5">
          <div className="flex items-center gap-2.5">
            <Volume2 size={16} className="text-navy-600 dark:text-navy-300" />
            <div>
              <p className="text-xs font-semibold text-navy-900 dark:text-white">Voice Speech Synthesis</p>
              <p className="text-[10px] text-navy-400">Speak answers out loud using browser TTS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVoiceOutput(!voiceOutput)}
            className={`w-11 h-6 rounded-full transition-colors relative ${voiceOutput ? 'gradient-primary' : 'bg-navy-200 dark:bg-navy-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${voiceOutput ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={handleSave}
          className="w-full h-12 rounded-2xl gradient-primary text-white font-semibold text-xs shadow-soft transition-transform active:scale-[0.98]"
        >
          Save AI Preferences
        </button>
      </div>
    </div>
  );
}
