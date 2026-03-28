import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenido detiene propagación para no cerrar al clickear adentro */}
      <div
        className="relative w-full max-w-lg mx-4 bg-(--bg-primary) rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-(--border-subtle) animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-(--border-subtle)">
            <h2
              className="text-2xl text-(--text-primary)"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-(--text-secondary) hover:text-(--text-primary) transition-all text-xl cursor-pointer p-2 -mr-2 rounded-lg hover:bg-(--bg-hover)"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
