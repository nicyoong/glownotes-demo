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

  const triggerAiInsight = async () => {
    if (!activeNote?.content) return;
    setAiInsight('Thinking...');
    const insight = await summarizeNote(activeNote.content);
    setAiInsight(insight);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(v) => { 
          setCurrentView(v); 
          if (v === 'actions') setActiveNoteId(null);
          setIsSidebarOpen(false); // 👈 auto-close on mobile
        }} 
        onNewNote={() => {
          handleNewNote();
          setIsSidebarOpen(false); // 👈 auto-close
        }}
        isOpen={isSidebarOpen}
      />

      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-lg border"
        onClick={() => setIsSidebarOpen(prev => !prev)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="flex-1 flex overflow-hidden">
        {currentView === 'actions' ? (
          <div className="flex-1 bg-[#FDFCFB] overflow-y-auto">
            <ActionReview 
              actions={actions} 
              notes={notes} 
              onToggleAction={handleToggleAction} 
              onDeleteAction={handleDeleteAction} 
            />
          </div>
        ) : (
          <>
            {/* Note List */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-[#FDFCFB]/50">
              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your light..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                  />
                  <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {filteredNotes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group ${
                      activeNoteId === note.id 
                        ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold truncate pr-4 ${!note.title ? 'text-slate-300 italic' : 'text-slate-700'}`}>
                        {note.title || 'Untitled'}
                      </h3>
                      {note.isPinned && (
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {note.content || 'No content yet...'}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-300 uppercase font-bold tracking-tighter">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveNote({...note, isPinned: !note.isPinned});
                            }}
                            className="p-1 hover:text-amber-500 text-slate-300"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveNote({...note, isArchived: !note.isArchived});
                              if (activeNoteId === note.id) setActiveNoteId(null);
                            }}
                            className="p-1 hover:text-indigo-500 text-slate-300"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </button>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredNotes.length === 0 && (
                  <div className="text-center py-20 px-4">
                    <p className="text-slate-300 text-sm">No notes found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative flex flex-col">
              {activeNote ? (
                <>
                  <Editor 
                    note={activeNote} 
                    onSave={handleSaveNote} 
                    onActionCreate={handleCreateAction}
                    isFocusMode={isFocusMode}
                    onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                  />
                  {/* AI Floating Helper */}
                  {!isFocusMode && (
                    <div className="absolute bottom-8 right-8 z-20">
                      {aiInsight && (
                        <div className="mb-4 max-w-xs bg-white p-4 rounded-2xl shadow-2xl border border-amber-100 animate-in fade-in slide-in-from-bottom-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-amber-500 uppercase">Glow Insight</span>
                            <button onClick={() => setAiInsight(null)} className="text-slate-300 hover:text-slate-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{aiInsight}"
                          </p>
                        </div>
                      )}
                      <button 
                        onClick={triggerAiInsight}
                        className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 shadow-xl shadow-amber-200 hover:scale-110 active:scale-90 transition-all group"
                      >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-white">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-400 mb-2 serif">Select or create a note</h2>
                  <p className="text-slate-300">Your digital sanctum awaits.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
