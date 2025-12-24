
export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: number;
  category?: string;
}

export interface Action {
  id: string;
  noteId: string;
  text: string;
  completed: boolean;
  createdAt: number;
  color: string;
}

export type ViewType = 'all' | 'actions' | 'archive' | 'pinned';

export interface EditorState {
  isFocusMode: boolean;
  isSaving: boolean;
  activeNoteId: string | null;
}
