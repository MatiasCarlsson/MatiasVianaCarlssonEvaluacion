import React from "react";

interface CategoryBadgeProps {
  name: string;
  color: string;
  variant?: "badge" | "dot";
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  color,
  variant = "badge",
  onClick,
}) => {
  if (variant === "dot") {
    return (
      <div
        className="size-4 rounded-full border-2 border-(--border-subtle) shrink-0"
        style={{ backgroundColor: color }}
        title={name}
      />
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.1 rounded-full text-sm font-medium transition-colors duration-200 ${onClick ? "cursor-pointer hover:bg-(--bg-hover)" : "cursor-default"} text-(--text-primary)
      `}
    >
      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {name}
    </button>
  );
};
