import { describe, it, expect } from 'vitest';
import { calls, notes, contacts, reminders } from '../data';

// ─── Calls ───────────────────────────────────────────────────────────────────
describe('Static calls data', () => {
  it('has exactly 8 call records', () => {
    expect(calls).toHaveLength(8);
  });

  it('every call has required fields', () => {
    for (const c of calls) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('contactName');
      expect(c).toHaveProperty('phone');
      expect(c).toHaveProperty('type');
      expect(c).toHaveProperty('date');
      expect(c).toHaveProperty('time');
      expect(c).toHaveProperty('duration');
      expect(c).toHaveProperty('avatarColor');
    }
  });

  it('call types are only incoming | outgoing | missed', () => {
    const valid = new Set(['incoming', 'outgoing', 'missed']);
    for (const c of calls) {
      expect(valid.has(c.type)).toBe(true);
    }
  });

  it('has 3 incoming calls', () => {
    expect(calls.filter((c) => c.type === 'incoming')).toHaveLength(3);
  });

  it('has 3 outgoing calls', () => {
    expect(calls.filter((c) => c.type === 'outgoing')).toHaveLength(3);
  });

  it('has 2 missed calls', () => {
    expect(calls.filter((c) => c.type === 'missed')).toHaveLength(2);
  });
});

// ─── Notes ───────────────────────────────────────────────────────────────────
describe('Static notes data', () => {
  it('has exactly 8 notes', () => {
    expect(notes).toHaveLength(8);
  });

  it('every note has required fields', () => {
    for (const n of notes) {
      expect(n).toHaveProperty('id');
      expect(n).toHaveProperty('title');
      expect(n).toHaveProperty('content');
      expect(n).toHaveProperty('category');
      expect(n).toHaveProperty('tags');
      expect(n).toHaveProperty('date');
      expect(typeof n.pinned).toBe('boolean');
      expect(n).toHaveProperty('color');
    }
  });

  it('has exactly 3 pinned notes (n1, n2, n4)', () => {
    const pinned = notes.filter((n) => n.pinned);
    expect(pinned).toHaveLength(3);
    const pinnedIds = pinned.map((n) => n.id);
    expect(pinnedIds).toContain('n1');
    expect(pinnedIds).toContain('n2');
    expect(pinnedIds).toContain('n4');
  });

  it('tags is always an array', () => {
    for (const n of notes) {
      expect(Array.isArray(n.tags)).toBe(true);
    }
  });
});

// ─── Contacts ────────────────────────────────────────────────────────────────
describe('Static contacts data', () => {
  it('has exactly 6 contacts', () => {
    expect(contacts).toHaveLength(6);
  });

  it('every contact has required fields', () => {
    for (const c of contacts) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('phone');
      expect(c).toHaveProperty('initials');
      expect(c).toHaveProperty('avatarColor');
    }
  });
});

// ─── Reminders ───────────────────────────────────────────────────────────────
describe('Static reminders data', () => {
  it('has exactly 8 reminders', () => {
    expect(reminders).toHaveLength(8);
  });

  it('every reminder has required fields', () => {
    for (const r of reminders) {
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('title');
      expect(r).toHaveProperty('time');
      expect(r).toHaveProperty('date');
      expect(typeof r.completed).toBe('boolean');
      expect(typeof r.recurring).toBe('boolean');
    }
  });

  it('today reminders are r1, r2, r3', () => {
    const today = reminders.filter((r) => r.date === 'Today');
    const todayIds = today.map((r) => r.id);
    expect(todayIds).toContain('r1');
    expect(todayIds).toContain('r2');
    expect(todayIds).toContain('r3');
  });

  it('r3 is the only completed reminder', () => {
    const completed = reminders.filter((r) => r.completed);
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe('r3');
  });
});
