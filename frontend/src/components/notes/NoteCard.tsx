import React from "react";
import type { Note } from "../../types/note.types";
import { formatDate, truncate } from "../../lib/utils";

interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onArchive: (id: string, isArchived: boolean) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onSelect, onArchive, onDelete }) => {
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(note.id, !note.isArchived);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const styles = {
    button:
      "text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors rounded-lg cursor-pointer hover:scale-105 focus:scale-95 bg-(--bg-hover) p-2",
  };

  return (
    <div
      onClick={() => onSelect(note)}
      className="relative bg-(--bg-card) rounded-xl p-5 cursor-pointer border border-transparent hover:border-(--border-hover) transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col gap-3"
    >
      <h3
        className="text-(--text-primary) text-lg font-medium leading-snug"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {note.title}
      </h3>

      {/* Preview del contenido */}
      <p className="text-(--text-secondary) text-sm leading-relaxed">
        {truncate(note.content, 100)}
      </p>

      {/* Etiquetas de categorí­as */}
      {note.note_categories && note.note_categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 ">
          {note.note_categories.map((nc) => {
            const color = nc.categories.color ?? "#8892a0";
            return (
              <span
                key={nc.categoryId}
                className="text-[10px] px-2 py-0.5 rounded-full hover:scale-110 transition-all duration-300"
                style={{
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}40`,
                }}
              >
                {nc.categories.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Footer: fecha + acciones */}
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-(--border-subtle)">
        {/* Fecha */}
        <span className="text-sm text-(--text-secondary)">{formatDate(note.updatedAt)}</span>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleArchive}
            className={styles.button}
            title={note.isArchived ? "Desarchivar" : "Archivar"}
          >
            {note.isArchived ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 rotate-180"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
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
          </button>
          <button
            onClick={handleDelete}
            className={`${styles.button} hover:text-[#c0392b] hover:bg-[#ef4444]/10`}
            title="Eliminar"
          >
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
