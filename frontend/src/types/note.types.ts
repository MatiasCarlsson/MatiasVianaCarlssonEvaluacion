export interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  note_categories?: NoteCategory[];
}

export interface NoteCategory {
  noteId: string;
  categoryId: string;
  categories: Category;
}

export interface Category {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}

export interface ArchiveNotePayload {
  isArchived: boolean;
}
