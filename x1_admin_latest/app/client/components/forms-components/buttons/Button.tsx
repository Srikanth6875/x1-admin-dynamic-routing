import React from "react";

type ButtonVariant =
  | "add"
  | "edit"
  | "delete"
  | "cancel"
  | "submit"
  | "default";

type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  // Allow other native button props
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  add: "bg-blue-600 text-white hover:bg-blue-700",
  edit: "bg-yellow-400 hover:bg-yellow-500",
  delete: "bg-red-500 hover:bg-red-600",
  cancel: "bg-gray-300 text-gray-800 hover:bg-gray-400",
  submit: "bg-blue-600 text-white hover:bg-blue-700",
  default: "bg-gray-200 hover:bg-gray-300",
};

export function Button({
  onClick,
  label,
  variant = "default",
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  ...rest
}: ButtonProps) {

  const isDisabled = disabled || loading;

  const baseStyles =
    "min-w-[120px] px-5 py-2 text-sm rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
      {...rest}
    >
      {loading
        ? variant === "submit"
          ? "Submitting..."
          : "Loading..."
        : label}
    </button>
  );
}
