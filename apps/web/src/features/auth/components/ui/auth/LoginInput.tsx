"use client";

import { cn } from "@/shared/utils/shadcn/utils";

import { LoginInputProps } from "./types";

export const LoginInput = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  label,
  error,
  className,
  inputClassName,
  required = true,
}: LoginInputProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full px-4 py-2.5 shadow-sm shadow-blue-200 bg-white/60 backdrop-blur-sm",
          "border border-white/40 rounded-xl text-gray-800 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent",
          "transition",
          error && "border-red-500 focus:ring-red-400/60",
          inputClassName,
        )}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
