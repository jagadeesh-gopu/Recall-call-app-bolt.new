# RecallCall — Smart Personal Communication & Memory Application

RecallCall is a modern personal communication and productivity application built with React 18, TypeScript, Tailwind CSS, Supabase, and Local AI. It helps users effortlessly organize call records, smart notes, contacts, and reminders.

---

## 🚀 Key Features

1. **Authentication & Security**:
   - Phone OTP Authentication powered by Supabase.
   - Demo mode auto-skip for zero-friction testing.
   - Row Level Security (RLS) ensuring every user only accesses their own private records.

2. **Contact Memory**:
   - Create, edit, and delete contact records.
   - Memory summaries to store important context about individuals.
   - Associated call logs, notes, and reminders per contact.
   - One-tap device dialer (`tel:`), SMS (`sms:`), and email (`mailto:`).

3. **Call History Management**:
   - Incoming, outgoing, and missed call logs with timestamps and duration.
   - Log new calls with discussion notes.
   - Search by name, phone number, or call notes.
   - Native device dialer integration.

4. **Smart Notes**:
   - AI-assisted note generation and summarization.
   - Associate notes directly with contacts.
   - Pinned notes, category filtering (Personal, Work, College, Important).
   - Voice dictation via Web Speech API.

5. **Reminders & Tasks**:
   - Today, upcoming, and completed reminders.
   - One-tap completion toggle.
   - Recurring tasks support and contact association.
   - Voice quick-create input.

6. **AI Assistant & Voice**:
   - **Google Gemini (Flash & Pro)**: High-speed reasoning with user context RAG via Google AI Studio (`gemini-1.5-flash`, `gemini-1.5-pro`).
   - **Built-in Local Brain**: Zero installation, runs 100% offline in browser with natural-language matching.
   - **Ollama / Local LLM**: Connects to `http://localhost:11434` (`llama3`, `mistral`, `phi3`, `qwen2.5`) with private context RAG.
   - **Web Speech API**: Hands-free voice commands and spoken audio responses.

7. **Universal Search**:
   - Fast, application-wide search across contacts, notes, calls, and reminders.
   - Category filtering and direct navigation to matching records.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript 5.5, Vite 7
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL with RLS)
- **AI**: Google Gemini (1.5 Flash & Pro), Local Models (Ollama, LM Studio), Built-in Semantic Engine
- **Speech**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Testing**: Vitest, Happy-DOM, React Testing Library

---

## 📦 Getting Started

### 1. Installation

```bash
cd Recall-call-app-bolt.new
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key # Optional (from Google AI Studio)
```

> **Note**: If `.env` is omitted, RecallCall operates seamlessly in **Demo Mode** using in-memory local data.

### 3. Database Migration (Supabase)

Run the SQL migration in `supabase/migrations/20250101000000_schema.sql` inside your Supabase project's **SQL Editor**. This sets up:
- `profiles`, `contacts`, `notes`, `reminders`, `calls` tables.
- Row Level Security (RLS) policies.
- Automatic profile creation trigger on signup.

### 4. Running the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Run the Vitest test suite:

```bash
# Run all 104 tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🚢 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import your project in [Vercel](https://vercel.com).
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Environment Variables.
4. Deploy! (`vercel.json` rewrite is pre-configured).

### Deploying to Netlify
1. Connect your repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`, Publish directory: `dist`.
3. Add your environment variables in Netlify site settings.
4. Deploy! (`netlify.toml` rewrite is pre-configured).
