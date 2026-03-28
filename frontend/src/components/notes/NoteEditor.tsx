import React, { useState } from "react";
import type { Note, UpdateNotePayload } from "../../types/note.types";
import type { Category } from "../../types/category.types";
import { Button } from "../ui/Button";

interface NoteEditorProps {
  note: Note;
  allCategories: Category[];
  onClose: () => void;
  onSave: (id: string, payload: UpdateNotePayload) => Promise<Note | void>;
  onArchive: (id: string, isArchived: boolean) => Promise<void>;
  onAddCategory: (noteId: string, categoryId: string) => Promise<void>;
  onRemoveCategory: (noteId: string, categoryId: string) => Promise<void>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  allCategories,
  onClose,
  onSave,
  onArchive,
  onAddCategory,
  onRemoveCategory,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [assignedCategoryIds, setAssignedCategoryIds] = useState<Set<string>>(
    new Set(note.note_categories?.map((nc) => nc.categoryId) ?? []),
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(note.id, { title: title.trim(), content: content.trim() });
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await onArchive(note.id, !note.isArchived);
      onClose();
    } finally {
      setArchiving(false);
    }
  };

  const toggleCategory = async (categoryId: string) => {
    const isAssigned = assignedCategoryIds.has(categoryId);

    // Actualización optimista: el badge cambia inmediatamente, sin esperar al servidor
    if (isAssigned) {
      setAssignedCategoryIds((prev) => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    } else {
      setAssignedCategoryIds((prev) => new Set([...prev, categoryId]));
    }

    try {
      if (isAssigned) {
        await onRemoveCategory(note.id, categoryId);
      } else {
        await onAddCategory(note.id, categoryId);
      }
    } catch (e) {
      // Rollback en caso de error
      console.error("Error toggling category", e);
      if (isAssigned) {
        setAssignedCategoryIds((prev) => new Set([...prev, categoryId]));
      } else {
        setAssignedCategoryIds((prev) => {
          const next = new Set(prev);
          next.delete(categoryId);
          return next;
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tí­tulo + cerrar */}
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-xl text-(--text-primary) font-medium focus:outline-none flex-1 mr-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        />
        <button
          onClick={onClose}
          className="text-(--text-secondary) hover:text-(--text-primary) transition-all text-xl cursor-pointer p-2 -mr-2 rounded-lg hover:bg-(--bg-hover)"
        >
          ✕
        </button>
      </div>

      {/* Contenido */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="bg-transparent text-(--text-primary) text-sm leading-relaxed resize-none focus:outline-none"
        placeholder="Escribí tu nota..."
      />

      {allCategories.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-(--border-subtle) pt-3">
          <p className="text-xs text-(--text-secondary) uppercase tracking-widest font-semibold">
            Categorías
          </p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const isAssigned = assignedCategoryIds.has(cat.id);
              const color = cat.color ?? "#4a90d9";
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer  transition-all hover:shadow-sm"
                  style={{
                    border: `2px solid ${isAssigned ? color : "var(--border-subtle)"}`,
                    color: isAssigned ? color : "var(--text-secondary)",
                    backgroundColor: "transparent",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between border-t border-(--border-subtle) pt-3">
        <Button variant="ghost" onClick={handleArchive} loading={archiving}>
          {note.isArchived ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-6 rotate-180"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-6"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125"
              />
            </svg>
          )}
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Guardar
        </Button>
      </div>
    </div>
  );
};
