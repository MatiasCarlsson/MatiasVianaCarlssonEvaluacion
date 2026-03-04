/**
 * EmptyState.tsx
 *
 * QUÃ‰ HACE:
 *   Componente de placeholder cuando no hay notas que mostrar.
 *   Muestra un Ã­cono ilustrativo, un tÃ­tulo y un mensaje descriptivo.
 *   Opcionalmente muestra un botÃ³n de acciÃ³n (ej. "Crear primera nota").
 *
 * PROPS:
 *   title?: string         â†’ ej. "No hay notas activas"
 *   message?: string       â†’ ej. "Crea una nota para empezar"
 *   actionLabel?: string   â†’ texto del botÃ³n opcional
 *   onAction?: () => void  â†’ callback del botÃ³n opcional
 *
 * DÃ“NDE SE USA:
 *   En NoteList cuando notes.length === 0.
 */
import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nada por aquí",
  message = "No hay notas que mostrar.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-20 text-center">
      <span className="text-6xl opacity-30">📋</span>

      <h2
        className="text-2xl text-(--text-primary) opacity-60"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {title}
      </h2>

      <p className="text-sm text-(--text-secondary) max-w-xs">{message}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
