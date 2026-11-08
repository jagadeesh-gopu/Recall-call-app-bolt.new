export type Screen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'assistant'
  | 'notes'
  | 'noteEditor'
  | 'contacts'
  | 'contactDetail'
  | 'calls'
  | 'reminders'
  | 'search'
  | 'profile';

export type Theme = 'light' | 'dark';

export type CallType = 'incoming' | 'outgoing' | 'missed';

export interface CallRecord {
  id: string;
  contactName: string;
  phone: string;
  type: CallType;
  date: string;
  time: string;
  duration: string;
  avatarColor: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  date: string;
  pinned: boolean;
  color: string;
}

export type NoteCategory = 'Personal' | 'College' | 'Work' | 'Contacts' | 'Important' | 'Reminders';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  memorySummary: string;
  lastInteraction: string;
  avatarColor: string;
  initials: string;
  notes: number;
  calls: number;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  recurring: boolean;
  contactName?: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  results?: CallRecord[];
  timestamp: string;
}

export interface SearchResult {
  type: 'call' | 'contact' | 'note' | 'reminder';
  title: string;
  subtitle: string;
  meta: string;
}
