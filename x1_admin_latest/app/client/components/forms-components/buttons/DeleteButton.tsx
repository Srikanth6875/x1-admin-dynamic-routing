type DeleteButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export function DeleteButton({ onClick, label = "Delete", className = "" }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ${className}`}
      type="button"
    >
      {label}
    </button>
  );
}
