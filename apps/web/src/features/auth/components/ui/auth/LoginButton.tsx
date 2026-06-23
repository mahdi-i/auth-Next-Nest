"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils/shadcn/utils";
import { LoginButtonProps } from "./types";
export const LoginButton = ({
  type = "submit",
  onClick,
  loading = false,
  variant = "primary",
  className,
  children,
}: LoginButtonProps) => {
  const variantClasses = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40",
    secondary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40",
    ghost:
      "text-indigo-600 hover:text-indigo-800 font-medium bg-transparent hover:bg-indigo-50/30",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={cn(
        "w-full py-5 font-semibold rounded-xl transition-all duration-200 cursor-pointer",
        variantClasses[variant],
        loading && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
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
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};
