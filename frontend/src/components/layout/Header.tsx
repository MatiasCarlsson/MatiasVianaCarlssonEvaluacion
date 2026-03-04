import { useAppContext } from "../../hooks/useAppContext";

interface HeaderProps {
  title: string;
  categoryColor?: string;
  onNewNote?: () => void;
}

export const Header = ({ title, categoryColor, onNewNote }: HeaderProps) => {
  const { theme, toggleTheme } = useAppContext();
  return (
    <header className="relative mt-4 px-6 pb-4 flex items-center justify-between w-full border-b border-(--border-subtle) min-h-15">
      <div className="z-10 shrink-0 flex items-center">
        {onNewNote && (
          <button
            onClick={onNewNote}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--bg-hover) hover:bg-(--border-subtle) text-(--text-primary) text-sm whitespace-nowrap cursor-pointer hover:scale-105 transition-all focus:scale-100 group"
            title="Nueva nota"
          >
            <span className="text-lg leading-none group-hover:rotate-180 transition-all duration-600">
              +
            </span>
            Nueva nota
          </button>
        )}
      </div>

      <h1
        className="absolute left-1/2 top-1/2 pb-4 -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl text-(--text-primary) pointer-events-none"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {title}
      </h1>

      <div className="z-10 shrink-0 flex items-center">
        {theme === "dark" ? (
          <button
            onClick={toggleTheme}
            className="px-2 py-1 text-sm bg-(--bg-hover) text-(--text-primary) rounded-lg mr-2 cursor-pointer hover:scale-110 transition-all focus:scale-100"
          >
            ☀️
          </button>
        ) : (
          <button
            onClick={toggleTheme}
            className="px-2 py-1 text-sm bg-(--bg-hover) text-(--text-primary) rounded-lg mr-2 cursor-pointer hover:scale-110 transition-all focus:scale-100"
          >
            🌙
          </button>
        )}
        {categoryColor && (
          <div
            className="size-4 rounded-full border-2 border-(--border-subtle) shadow-sm ml-auto"
            style={{ backgroundColor: categoryColor }}
            title="Categoría activa"
          />
        )}
      </div>
    </header>
  );
};
