
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Note, Action } from '../types';
import { Button } from './Button';
import { ACTION_COLORS } from '../constants';

interface EditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onActionCreate: (action: Omit<Action, 'id' | 'createdAt' | 'completed'>) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  note, 
  onSave, 
  onActionCreate, 
  isFocusMode, 
  onToggleFocusMode 
}) => {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [selection, setSelection] = useState<{ x: number, y: number, text: string } | null>(null);
  const [focusedParagraphIndex, setFocusedParagraphIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note.id, note.content, note.title]);

  const handleSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({
        x: rect.left + rect.width / 2,
        y: rect.top - 40,
        text: sel.toString().trim()
      });
    } else {
      setSelection(null);
    }
  };

  const createAction = () => {
    if (!selection) return;
    const randomColor = ACTION_COLORS[Math.floor(Math.random() * ACTION_COLORS.length)];
    onActionCreate({
      noteId: note.id,
      text: selection.text,
      color: randomColor
    });
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const paragraphs = content.split('\n').filter(p => p.trim() !== '' || p === '');

  const handleContentUpdate = (index: number, newVal: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = newVal;
    const updatedContent = newParagraphs.join('\n');
    setContent(updatedContent);
    onSave({ ...note, content: updatedContent, title, updatedAt: Date.now() });
  };

  return (
    <div className={`flex-1 h-full overflow-y-auto bg-white transition-all duration-700 ${isFocusMode ? 'focus-mode' : ''}`}>
      <div className="max-w-3xl mx-auto py-24 px-12">
        <div className="mb-12 group">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onSave({ ...note, title: e.target.value, updatedAt: Date.now() });
            }}
            placeholder="Untitled Wisdom"
            className="w-full text-5xl font-semibold serif bg-transparent border-none focus:outline-none placeholder-slate-200"
          />
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
            <span>•</span>
            <button onClick={onToggleFocusMode} className="hover:text-amber-500 transition-colors">
              {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
            </button>
          </div>
        </div>

        <div 
          ref={editorRef}
          onMouseUp={handleSelection}
          className="space-y-6 text-xl leading-relaxed text-slate-700"
        >
          {paragraphs.map((p, i) => (
            <div 
              key={i} 
              className={`note-paragraph relative group ${focusedParagraphIndex === i ? 'focused' : ''}`}
              onFocus={() => setFocusedParagraphIndex(i)}
              onClick={() => setFocusedParagraphIndex(i)}
            >
              <textarea
                value={p}
                onChange={(e) => handleContentUpdate(i, e.target.value)}
                placeholder={i === 0 ? "Type something soulful..." : ""}
                className="w-full bg-transparent border-none resize-none focus:outline-none overflow-hidden"
                rows={p.split('\n').length || 1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
          ))}
          {paragraphs.length === 0 && (
             <textarea
                value=""
                onChange={(e) => handleContentUpdate(0, e.target.value)}
                placeholder="Start your glowing journey..."
                className="w-full bg-transparent border-none resize-none focus:outline-none overflow-hidden"
                rows={1}
             />
          )}
        </div>
      </div>

      {selection && (
        <div 
          className="fixed z-50 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200"
          style={{ left: selection.x, top: selection.y, transform: 'translateX(-50%)' }}
        >
          <button 
            onClick={createAction}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-2xl shadow-slate-400 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Make Action
          </button>
        </div>
      )}
    </div>
  );
};
