import type { CallRecord, Note, Contact, Reminder, ChatMessage } from './types';

export const calls: CallRecord[] = [
  { id: 'c1', contactName: 'Rahul Sharma', phone: '+91 98765 43210', type: 'incoming', date: 'Today', time: '6:30 PM', duration: '12:45', avatarColor: 'from-indigo-400 to-violet-400' },
  { id: 'c2', contactName: 'Priya Patel', phone: '+91 98123 45678', type: 'outgoing', date: 'Today', time: '3:15 PM', duration: '05:20', avatarColor: 'from-pink-400 to-rose-400' },
  { id: 'c3', contactName: 'Unknown Number', phone: '+91 90000 12345', type: 'missed', date: 'Today', time: '1:02 PM', duration: '00:00', avatarColor: 'from-gray-400 to-slate-400' },
  { id: 'c4', contactName: 'Dr. Mehta', phone: '+91 99887 76655', type: 'incoming', date: 'Yesterday', time: '8:45 PM', duration: '18:30', avatarColor: 'from-emerald-400 to-teal-400' },
  { id: 'c5', contactName: 'Mom', phone: '+91 98765 11111', type: 'outgoing', date: 'Yesterday', time: '7:00 PM', duration: '32:10', avatarColor: 'from-amber-400 to-orange-400' },
  { id: 'c6', contactName: 'Arjun Reddy', phone: '+91 90909 80808', type: 'missed', date: 'Yesterday', time: '2:15 PM', duration: '00:00', avatarColor: 'from-cyan-400 to-blue-400' },
  { id: 'c7', contactName: 'Sneha Kapoor', phone: '+91 98765 22222', type: 'incoming', date: 'Nov 3', time: '9:30 PM', duration: '07:45', avatarColor: 'from-violet-400 to-purple-400' },
  { id: 'c8', contactName: 'Tech Support', phone: '+91 1800 123 456', type: 'outgoing', date: 'Nov 2', time: '11:20 AM', duration: '22:15', avatarColor: 'from-sky-400 to-indigo-400' },
];

export const notes: Note[] = [
  { id: 'n1', title: 'Project Deadline Reminder', content: 'Submit the final year project report by November 15th. Need to coordinate with Rahul on the database module and finalize the presentation slides.', category: 'College', tags: ['project', 'deadline', 'team'], date: 'Nov 5, 2026', pinned: true, color: 'from-indigo-400 to-violet-400' },
  { id: 'n2', title: 'Mom Birthday Gift Ideas', content: 'Think about getting her a silk saree or a spa voucher. Check with Priya about splitting the cost. Maybe a surprise dinner at her favorite restaurant.', category: 'Personal', tags: ['family', 'gift'], date: 'Nov 4, 2026', pinned: true, color: 'from-pink-400 to-rose-400' },
  { id: 'n3', title: 'Q4 Meeting Notes', content: 'Team agreed to push the API migration to next sprint. Action items assigned to engineering team. Follow up with tech lead on Friday about the deployment schedule.', category: 'Work', tags: ['meeting', 'q4', 'api'], date: 'Nov 3, 2026', pinned: false, color: 'from-emerald-400 to-teal-400' },
  { id: 'n4', title: 'Dr. Mehta Prescription', content: 'Take the antibiotic twice daily for 5 days. Avoid dairy for 2 hours after each dose. Follow-up appointment scheduled for next Tuesday at 5 PM.', category: 'Important', tags: ['health', 'prescription'], date: 'Nov 1, 2026', pinned: true, color: 'from-amber-400 to-orange-400' },
  { id: 'n5', title: 'Rahul Contact Details', content: 'College project coordinator. Prefers communication over email. Works at Infosys, Bangalore. Best time to call is after 7 PM. Currently working on the backend architecture.', category: 'Contacts', tags: ['rahul', 'project'], date: 'Oct 28, 2026', pinned: false, color: 'from-cyan-400 to-blue-400' },
  { id: 'n6', title: 'Weekend Grocery List', content: 'Milk, eggs, bread, fresh vegetables, olive oil, and laundry detergent. Also pick up the dry cleaning from the shop near the apartment.', category: 'Personal', tags: ['shopping', 'home'], date: 'Oct 27, 2026', pinned: false, color: 'from-violet-400 to-purple-400' },
  { id: 'n7', title: 'Book Recommendations', content: 'Atomic Habits by James Clear, Deep Work by Cal Newport, and The Pragmatic Programmer. Priya recommended Sapiens as well.', category: 'Personal', tags: ['books', 'reading'], date: 'Oct 25, 2026', pinned: false, color: 'from-sky-400 to-indigo-400' },
  { id: 'n8', title: 'Client Follow-up', content: 'Call the client about the revised proposal. They wanted changes in the pricing structure and timeline. Email them the updated contract by Wednesday.', category: 'Work', tags: ['client', 'proposal'], date: 'Oct 24, 2026', pinned: false, color: 'from-rose-400 to-pink-400' },
];

export const contacts: Contact[] = [
  { id: 'ct1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@email.com', memorySummary: 'College project coordinator — working together on the final year project', lastInteraction: 'Called today at 6:30 PM', avatarColor: 'from-indigo-400 to-violet-400', initials: 'RS', notes: 3, calls: 12 },
  { id: 'ct2', name: 'Priya Patel', phone: '+91 98123 45678', email: 'priya.patel@email.com', memorySummary: 'Best friend since high school — loves adventure travel', lastInteraction: 'Called today at 3:15 PM', avatarColor: 'from-pink-400 to-rose-400', initials: 'PP', notes: 5, calls: 48 },
  { id: 'ct3', name: 'Dr. Mehta', phone: '+91 99887 76655', email: 'dr.mehta@clinic.com', memorySummary: 'Family physician — appointment every 3 months', lastInteraction: 'Called yesterday at 8:45 PM', avatarColor: 'from-emerald-400 to-teal-400', initials: 'DM', notes: 2, calls: 8 },
  { id: 'ct4', name: 'Arjun Reddy', phone: '+91 90909 80808', email: 'arjun.reddy@email.com', memorySummary: 'Gym trainer and fitness buddy — push sessions on Mondays', lastInteraction: 'Missed call yesterday', avatarColor: 'from-cyan-400 to-blue-400', initials: 'AR', notes: 1, calls: 15 },
  { id: 'ct5', name: 'Sneha Kapoor', phone: '+91 98765 22222', email: 'sneha.kapoor@email.com', memorySummary: 'Colleague from the marketing team — collaborates on campaigns', lastInteraction: 'Called Nov 3 at 9:30 PM', avatarColor: 'from-violet-400 to-purple-400', initials: 'SK', notes: 4, calls: 22 },
  { id: 'ct6', name: 'Unknown Number', phone: '+91 90000 12345', email: '', memorySummary: 'No saved memory — called once today, unanswered', lastInteraction: 'Missed call today at 1:02 PM', avatarColor: 'from-gray-400 to-slate-400', initials: '?', notes: 0, calls: 1 },
];

export const reminders: Reminder[] = [
  { id: 'r1', title: 'Call Rahul about project module', time: '5:00 PM', date: 'Today', completed: false, recurring: false, contactName: 'Rahul Sharma', category: 'College' },
  { id: 'r2', title: 'Pick up prescription from pharmacy', time: '6:30 PM', date: 'Today', completed: false, recurring: false, category: 'Important' },
  { id: 'r3', title: 'Team standup meeting', time: '10:00 AM', date: 'Today', completed: true, recurring: true, category: 'Work' },
  { id: 'r4', title: 'Send revised proposal to client', time: '11:00 AM', date: 'Tomorrow', completed: false, recurring: false, contactName: 'Sneha Kapoor', category: 'Work' },
  { id: 'r5', title: 'Mom birthday dinner reservation', time: '8:00 PM', date: 'Nov 12', completed: false, recurring: false, contactName: 'Mom', category: 'Personal' },
  { id: 'r6', title: 'Follow-up with Dr. Mehta', time: '5:00 PM', date: 'Nov 14', completed: false, recurring: false, contactName: 'Dr. Mehta', category: 'Important' },
  { id: 'r7', title: 'Submit project report', time: '11:59 PM', date: 'Nov 15', completed: false, recurring: false, contactName: 'Rahul Sharma', category: 'College' },
  { id: 'r8', title: 'Gym session with Arjun', time: '7:00 AM', date: 'Nov 10', completed: false, recurring: true, contactName: 'Arjun Reddy', category: 'Personal' },
];

export const chatHistory: ChatMessage[] = [
  { id: 'm1', role: 'user', text: 'Who called me last Sunday evening?', timestamp: '6:45 PM' },
  { id: 'm2', role: 'assistant', text: 'I found 3 calls matching your request from last Sunday evening.', results: [
    { id: 'r1', contactName: 'Sneha Kapoor', phone: '+91 98765 22222', type: 'incoming', date: 'Sunday', time: '9:30 PM', duration: '07:45', avatarColor: 'from-violet-400 to-purple-400' },
    { id: 'r2', contactName: 'Mom', phone: '+91 98765 11111', type: 'outgoing', date: 'Sunday', time: '7:00 PM', duration: '32:10', avatarColor: 'from-amber-400 to-orange-400' },
    { id: 'r3', contactName: 'Arjun Reddy', phone: '+91 90909 80808', type: 'missed', date: 'Sunday', time: '5:15 PM', duration: '00:00', avatarColor: 'from-cyan-400 to-blue-400' },
  ], timestamp: '6:45 PM' },
];

export const onboardingSlides = [
  {
    id: 0,
    icon: 'Phone',
    title: 'Remember every call',
    description: 'Never lose track of a conversation. RecallCall logs and organizes every call automatically.',
    color: 'from-indigo-400 to-violet-400',
  },
  {
    id: 1,
    icon: 'StickyNote',
    title: 'Smart Notes for everything',
    description: 'Capture important information with AI-assisted notes that are searchable and organized.',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 2,
    icon: 'Search',
    title: 'Find contacts naturally',
    description: 'Just ask in plain language. "Who called last Sunday?" and get instant, accurate answers.',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    id: 3,
    icon: 'Bell',
    title: 'Never forget a reminder',
    description: 'Set intelligent reminders linked to contacts and notes. Your memory, always within reach.',
    color: 'from-amber-400 to-orange-400',
  },
];

export const categoryColors: Record<string, string> = {
  'Personal': 'from-pink-400 to-rose-400',
  'College': 'from-indigo-400 to-violet-400',
  'Work': 'from-emerald-400 to-teal-400',
  'Contacts': 'from-cyan-400 to-blue-400',
  'Important': 'from-amber-400 to-orange-400',
  'Reminders': 'from-violet-400 to-purple-400',
};

export const searchResults = {
  query: 'Rahul',
  calls: [
    { id: 's1', title: 'Rahul Sharma', subtitle: 'Incoming call · 12:45 min', meta: 'Today, 6:30 PM' },
    { id: 's2', title: 'Rahul Sharma', subtitle: 'Outgoing call · 03:20 min', meta: 'Nov 3, 2:15 PM' },
  ],
  contacts: [
    { id: 's3', title: 'Rahul Sharma', subtitle: 'College project coordinator', meta: '+91 98765 43210' },
  ],
  notes: [
    { id: 's4', title: 'Project Deadline Reminder', subtitle: 'Submit the final year project report...', meta: 'College · Nov 5' },
    { id: 's5', title: 'Rahul Contact Details', subtitle: 'College project coordinator. Prefers...', meta: 'Contacts · Oct 28' },
  ],
  reminders: [
    { id: 's6', title: 'Call Rahul about project module', subtitle: 'Today at 5:00 PM', meta: 'College' },
    { id: 's7', title: 'Submit project report', subtitle: 'Nov 15 at 11:59 PM', meta: 'College' },
  ],
  memories: [
    { id: 's8', title: 'Rahul Sharma — Memory', subtitle: 'Working together on final year project', meta: '12 calls · 3 notes' },
  ],
};
