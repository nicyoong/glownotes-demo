
import React from 'react';
import { Action, Note } from '../types';

interface ActionReviewProps {
  actions: Action[];
  notes: Note[];
  onToggleAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
}

export const ActionReview: React.FC<ActionReviewProps> = ({ 
  actions, 
  notes, 
  onToggleAction, 
  onDeleteAction 
}) => {
  const pendingActions = actions.filter(a => !a.completed);
  const completedActions = actions.filter(a => a.completed);

  const getNoteTitle = (noteId: string) => notes.find(n => n.id === noteId)?.title || 'Untitled Note';

  // Fix: Explicitly type ActionCard as React.FC to allow React's special 'key' prop when rendering in lists
  const ActionCard: React.FC<{ action: Action }> = ({ action }) => (
    <div className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-amber-200 dark:glow transition-all duration-300">
      <button 
        onClick={() => onToggleAction(action.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          action.completed 
            ? 'bg-emerald-400 border-emerald-400 text-white' 
            : 'border-slate-200 hover:border-amber-400'
        }`}
      >
        {action.completed && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <p className={`text-sm ${action.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {action.text}
        </p>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1 block">
          From: {getNoteTitle(action.noteId)}
        </span>
      </div>
      <button 
        onClick={() => onDeleteAction(action.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-8">
      <header className="mb-12">
        <h2 className="text-4xl font-semibold serif mb-2">Daily Review</h2>
        <p className="text-slate-500">Your gentle reminders for a mindful day.</p>
      </header>

      <section className="space-y-4 mb-12">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Pending</h3>
        {pendingActions.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
            <p className="text-slate-400 text-sm">All clear! Enjoy your glowing state of flow.</p>
          </div>
        ) : (
          pendingActions.map(a => <ActionCard key={a.id} action={a} />)
        )}
      </section>

      {completedActions.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Completed</h3>
          <div className="opacity-60 space-y-4">
            {completedActions.map(a => <ActionCard key={a.id} action={a} />)}
          </div>
        </section>
      )}
    </div>
  );
};
