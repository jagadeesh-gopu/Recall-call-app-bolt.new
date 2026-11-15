import { useState, useEffect, useCallback } from 'react';
import type { Screen, Theme, Contact, Note } from './types';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { NotesScreen, NoteEditorScreen } from './screens/NotesScreen';
import { ContactsScreen, ContactDetailScreen } from './screens/ContactsScreen';
import { CallsScreen } from './screens/CallsScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav, FloatingVoiceButton, BackButton } from './components/Navigation';
import { useAuth } from './context/AuthContext';

const mainScreens: Screen[] = ['home', 'search', 'notes', 'contacts', 'profile'];

export default function App() {
  const { session, loading: authLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('splash');
  const [theme, setTheme] = useState<Theme>('light');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [noteEditorOpen, setNoteEditorOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [navHistory, setNavHistory] = useState<Screen[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // When auth state resolves, redirect appropriately
  useEffect(() => {
    if (authLoading) return;
    if (session) {
      // Already authenticated — skip splash/onboarding/auth and go to home
      setScreen((prev) => {
        if (prev === 'splash' || prev === 'onboarding' || prev === 'auth') {
          return 'home';
        }
        return prev;
      });
    }
  }, [session, authLoading]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const isMainScreen = mainScreens.includes(screen);

  const navigateTo = useCallback((s: Screen) => {
    setScreen((prev) => {
      setNavHistory((h) => [...h, prev]);
      return s;
    });
  }, []);

  const goBack = useCallback(() => {
    setNavHistory((h) => {
      if (h.length === 0) {
        setScreen('home');
        return h;
      }
      const newHistory = [...h];
      const prev = newHistory.pop()!;
      setScreen(prev);
      return newHistory;
    });
  }, []);

  const openAssistant = () => setAssistantOpen(true);
  const closeAssistant = () => setAssistantOpen(false);

  const openNoteEditor = (note?: Note) => {
    setEditingNote(note);
    setNoteEditorOpen(true);
  };
  const closeNoteEditor = () => {
    setNoteEditorOpen(false);
    setEditingNote(undefined);
  };

  const openContact = (c: Contact) => setSelectedContact(c);
  const closeContact = () => setSelectedContact(null);

  const showBackButton = isMainScreen && screen !== 'home';

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onDone={() => setScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onDone={() => setScreen('auth')} />;
      case 'auth':
        return <AuthScreen onSuccess={() => setScreen('home')} />;
      case 'home':
        return <HomeScreen onNavigate={navigateTo} onOpenAssistant={openAssistant} />;
      case 'calls':
        return <CallsScreen />;
      case 'notes':
        return <NotesScreen onOpenEditor={openNoteEditor} />;
      case 'contacts':
        return <ContactsScreen onOpenContact={openContact} />;
      case 'reminders':
        return <RemindersScreen />;
      case 'search':
        return (
          <SearchScreen
            onNavigate={navigateTo}
            onOpenContact={openContact}
            onOpenNote={openNoteEditor}
          />
        );
      case 'profile':
        return <ProfileScreen theme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <HomeScreen onNavigate={navigateTo} onOpenAssistant={openAssistant} />;
    }
  };

  return (
    <div className="phone-frame bg-navy-50 dark:bg-navy-950 relative overflow-hidden">
      {/* Splash / Onboarding / Auth — full screen, no nav */}
      {(screen === 'splash' || screen === 'onboarding' || screen === 'auth') && (
        <div className="min-h-screen">{renderScreen()}</div>
      )}

      {/* Main app screens with bottom nav */}
      {isMainScreen && (
        <>
          {showBackButton && <BackButton onBack={goBack} />}
          <div className="min-h-screen pb-2">{renderScreen()}</div>
          <FloatingVoiceButton onClick={openAssistant} />
          <BottomNav current={screen} onNavigate={navigateTo} onBack={goBack} />
        </>
      )}

      {/* Secondary screens (calls, reminders) with back nav to home */}
      {(screen === 'calls' || screen === 'reminders') && (
        <>
          <BackButton onBack={goBack} />
          <div className="min-h-screen pb-2">{renderScreen()}</div>
          <FloatingVoiceButton onClick={openAssistant} />
          <BottomNav current={'home'} onNavigate={navigateTo} onBack={goBack} />
        </>
      )}

      {/* Overlays */}
      {assistantOpen && <AssistantScreen onClose={closeAssistant} />}
      {noteEditorOpen && <NoteEditorScreen note={editingNote} onClose={closeNoteEditor} />}
      {selectedContact && (
        <ContactDetailScreen
          contact={selectedContact}
          onBack={closeContact}
          onOpenNoteEditor={(contactName) => {
            closeContact();
            openNoteEditor({
              id: '',
              title: `Note: ${contactName}`,
              content: `Key discussion with ${contactName}:\n• \nAction Items:\n- [ ] `,
              category: 'Personal',
              tags: [contactName.toLowerCase()],
              date: 'Today',
              pinned: false,
              color: 'from-indigo-400 to-violet-400',
            });
          }}
        />
      )}
    </div>
  );
}
