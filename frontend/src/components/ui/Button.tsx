import React from "react";

interface ButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-[#4a90d9] hover:bg-[#357abd] text-white",
  secondary: "bg-[var(--bg-hover)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)]",
  danger: "bg-[#c0392b] hover:bg-[#a93226] text-white",
  ghost: "bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-primary)]",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  children,
  className = "",
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        flex items-center justify-center gap-2
        px-3 py-1.5 rounded-lg text-sm font-medium
        transition-colors duration-200
        ${variantStyles[variant]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
};
