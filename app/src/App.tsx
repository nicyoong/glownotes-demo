import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ActionReview } from './components/ActionReview';
import { Note, Action, ViewType } from './types';
import { INITIAL_NOTES, INITIAL_ACTIONS } from './constants';
import { summarizeNote } from './geminiService';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [actions, setActions] = useState<Action[]>(INITIAL_ACTIONS);
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(INITIAL_NOTES[0].id);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);