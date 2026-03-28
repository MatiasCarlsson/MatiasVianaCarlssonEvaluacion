import React, { useState } from "react";
import type { Category } from "../../types/category.types";
import { CategoryList } from "../categories/CategoryList";

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  categories: Category[];
  onNewCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onNewNote?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  onFilterChange,
  categories,
  onNewCategory,
  onDeleteCategory,
  onNewNote,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Cierra el menú en móvil luego de seleccionar una opción
  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa*/}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-5 left-4 z-40 p-1.5 rounded-md bg-(--bg-hover) text-(--text-primary) hover:bg-(--border-subtle) transition-colors"
        title="Abrir menú"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay oscuro de fondo */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar contenedor */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50 w-52 md:w-60 min-h-screen text-center gap-2 bg-(--bg-sidebar) flex flex-col p-1 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} border-r border-(--border-subtle) shadow-2xl md:shadow-none
        `}
      >
        {/* Botón cerrar (X) dentro del menú en móvil */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-5 right-4 text-(--text-secondary) hover:text-(--text-primary) text-sm"
        >
          ✕
        </button>

        {/* Logo / título */}
        <h1
          className="text-3xl text-(--text-primary) mt-4 mb-2"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Notizen
        </h1>

        {/* Botón Nueva Nota (Solo visible en mobiil) */}
        {onNewNote && (
          <div className="md:hidden px-4 mb-4">
            <button
              onClick={() => {
                onNewNote();
                setIsOpen(false); // Cierra el menú al clickear
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#4a90d9] hover:bg-[#357abd] text-white text-sm font-medium transition-colors"
            >
              + Nueva nota
            </button>
          </div>
        )}

        {/* Navegación principal */}
        <p className="text-md font-semibold text-(--text-primary)]60">Menu</p>

        {/* Separador */}
        <hr className="border-t border-(--border-subtle) mb-1" />

        <section className="mx-auto flex justify-center w-full px-4">
          <div className="flex flex-col gap-2 w-full">
            <NavItem
              icon=""
              label="Notas activas"
              isActive={activeFilter === "active"}
              onClick={() => handleFilterChange("active")}
            />

            <NavItem
              icon=""
              label="Archivadas"
              isActive={activeFilter === "archived"}
              onClick={() => handleFilterChange("archived")}
            />
          </div>
        </section>

        {/* Separador */}
        <hr className="border-t border-(--border-subtle) mb-1" />

        {/* CategorÃ­as */}
        <div className="flex text-center items-center justify-evenly">
          <p className="text-md font-semibold tracking-widest text-(--text-primary)]60">
            Categorías
          </p>
          <button
            onClick={onNewCategory}
            className="size-7 flex items-center justify-center rounded-full bg-(--bg-hover) text-(--text-primary) hover:bg-(--border-hover) transition-all text-lg leading-none hover:rotate-180 duration-500 cursor-pointer"
            title="Nueva categoría"
          >
            +
          </button>
        </div>

        {/* Separador */}
        <hr className="border-t border-(--border-subtle) mb-1" />

        <CategoryList
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onDeleteCategory={onDeleteCategory}
        />
      </aside>
    </>
  );
};

// Componente interno para cada item de navegación
interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center md:justify-start px-4 py-2 gap-x-3 w-full cursor-pointer rounded-lg text-sm transition-colors
      ${
        isActive
          ? "bg-(--bg-hover) text-(--text-primary)"
          : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
      }
    `}
  >
    <span className="text-base">{icon}</span>
    {label}
  </button>
);
