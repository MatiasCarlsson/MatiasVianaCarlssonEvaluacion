/**
 * Layout.tsx
 *
 * QUÃ‰ HACE:
 *   Componente raÃ­z de la interfaz visual. Divide la pantalla en:
 *   - Sidebar (izquierda, fija): navegaciÃ³n y lista de categorÃ­as
 *   - Ãrea principal (derecha, flexible): children â†’ contenido de la pÃ¡gina
 *   Aplica el fondo oscuro global y el sistema de grid/flexbox del diseÃ±o.
 *
 * PROPS:
 *   children: React.ReactNode
 *   activeFilter, onFilterChange, categories, onNewCategory â†’ se pasan al Sidebar
 *
 * DÃ“NDE SE USA:
 *   Wrappea NotesPage y ArchivedPage.
 */

import React from "react";
import { Sidebar } from "./Sidebar";
import type { Category } from "../../types/category.types";

interface LayoutProps {
  children: React.ReactNode;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  categories: Category[];
  onNewCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onNewNote?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeFilter,
  onFilterChange,
  categories,
  onNewCategory,
  onDeleteCategory,
  onNewNote,
}) => {
  return (
    <div className="flex min-h-screen bg-(--bg-primary)">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        categories={categories}
        onNewCategory={onNewCategory}
        onDeleteCategory={onDeleteCategory}
        onNewNote={onNewNote}
      />

      {/* Ãrea de contenido principal */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-(--bg-primary)">
        {children}
      </main>
    </div>
  );
};
