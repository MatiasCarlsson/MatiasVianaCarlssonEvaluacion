export interface JsonNote {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JsonCategory {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
}

export interface JsonNoteCategory {
  noteId: string;
  categoryId: string;
}

export interface Database {
  notes: JsonNote[];
  categories: JsonCategory[];
  note_categories: JsonNoteCategory[];
}

export function emptyDatabase(): Database {
  return { notes: [], categories: [], note_categories: [] };
}

export interface NoteCategory {
  noteId: string;
  categoryId: string;
  categories: JsonCategory;
}

export type NoteWithCategories = JsonNote & {
  note_categories: NoteCategory[];
};
