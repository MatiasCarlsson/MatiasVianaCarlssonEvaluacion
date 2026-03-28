import { useState, useCallback, useEffect } from "react";
import type { Note, CreateNotePayload, UpdateNotePayload } from "../types/note.types";
import { notesApi } from "../api/notes.api";

type Filter = "active" | "archived" | string; // string = categoryId

export const useNotes = (filter: Filter = "active") => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga notas según el filtro activo
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Note[];
      if (filter === "archived") {
        data = await notesApi.getArchived();
      } else if (filter === "active") {
        data = await notesApi.getActive();
      } else {
        // filter es un categoryId
        data = await notesApi.getByCategory(filter);
      }
      setNotes(data);
    } catch {
      setError("Error al cargar las notas.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (payload: CreateNotePayload): Promise<Note> => {
    const newNote = await notesApi.create(payload);
    // Agrega la nueva nota al inicio de la lista sin recargar todo
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = async (id: string, payload: UpdateNotePayload): Promise<Note> => {
    // El backend ya retorna la nota completa con note_categories
    const updated = await notesApi.update(id, payload);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const deleteNote = async (id: string) => {
    await notesApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const setArchiveStatus = async (id: string, isArchived: boolean) => {
    await notesApi.setArchiveStatus(id, { isArchived });
    // Si el filtro es 'active' o 'archived', la nota desaparece de la lista actual
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Actualiza una única nota en la lista sin recargar todo (útil para actualizaciones optimistas)
  const updateNoteInList = (updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  return {
    notes,
    loading,
    error,
    refresh: fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setArchiveStatus,
    updateNoteInList,
  };
};
