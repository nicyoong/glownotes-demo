
import React from 'react';
import { Note, Action } from './types';

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Morning Reflections',
    content: 'Focus on the breath today. Remember to call the florist for the event tomorrow. The garden needs some attention this weekend.',
    isPinned: true,
    isArchived: false,
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Project Ideas: Lumina',
    content: 'Create a new design language for the mobile app. Check the color accessibility. Schedule a team sync on Friday.',
    isPinned: false,
    isArchived: false,
    updatedAt: Date.now() - 86400000,
  }
];

export const INITIAL_ACTIONS: Action[] = [
  {
    id: 'a1',
    noteId: '1',
    text: 'Call the florist for the event tomorrow',
    completed: false,
    createdAt: Date.now(),
    color: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'a2',
    noteId: '2',
    text: 'Schedule a team sync on Friday',
    completed: false,
    createdAt: Date.now(),
    color: 'bg-indigo-100 text-indigo-700',
  }
];

export const ACTION_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
  'bg-fuchsia-100 text-fuchsia-700',
];
