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

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    
    if (currentView === 'archive') {
      result = result.filter(n => n.isArchived);
    } else {
      result = result.filter(n => !n.isArchived);
      if (currentView === 'pinned') {
        result = result.filter(n => n.isPinned);
      }
    }

    if (searchQuery) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, currentView, searchQuery]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      isPinned: false,
      isArchived: false,
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setCurrentView('all');
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleCreateAction = (actionData: Omit<Action, 'id' | 'createdAt' | 'completed'>) => {
    const newAction: Action = {
      ...actionData,
      id: `a-${Date.now()}`,
      createdAt: Date.now(),
      completed: false
    };
    setActions([newAction, ...actions]);
  };

  const handleToggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleDeleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };