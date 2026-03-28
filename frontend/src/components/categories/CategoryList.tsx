import React from "react";
import type { Category } from "../../types/category.types";

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onSelect, onDelete }) => (
  <div
    className={`group flex items-center justify-between rounded-lg px-2 py-1 transition-colors ${isActive ? "bg-(--bg-hover)" : "hover:bg-(--bg-primary)"}`}
  >
    <button
      onClick={() => onSelect(category.id)}
      className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
    >
      <span
        className="size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: category.color ?? "#8892a0" }}
      />
      <span className="text-sm text-(--text-primary) truncate max-w-35">{category.name}</span>
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(category.id);
      }}
      className="opacity-0 group-hover:opacity-100 cursor-pointer p-1.5 md:opacity-0 md:group-hover:opacity-100 text-(--text-secondary) hover:text-[#ef4444] hover:rotate-180 duration-500 transition-all rounded-full ml-1 shrink-0 text-sm leading-none"
      title="Eliminar categoría"
    >
      ✕
    </button>
  </div>
);

interface CategoryListProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeFilter,
  onFilterChange,
  onDeleteCategory,
}) => (
  <section className="flex flex-col gap-1 px-3 overflow-y-auto">
    {categories.length === 0 && (
      <p className="text-sm text-(--text-secondary) px-2 py-1">Sin categorías</p>
    )}

    {categories.map((cat) => (
      <CategoryItem
        key={cat.id}
        category={cat}
        isActive={activeFilter === cat.id}
        onSelect={onFilterChange}
        onDelete={onDeleteCategory}
      />
    ))}
  </section>
);
