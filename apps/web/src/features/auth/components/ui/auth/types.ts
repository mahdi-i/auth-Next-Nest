export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}
export interface LoginInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export interface LoginHeaderProps {
  step: "send" | "verify";
  email?: string;
}

export interface LoginButtonProps {
  type?: "submit" | "button";
  onClick?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
}
