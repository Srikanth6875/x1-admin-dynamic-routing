type MessageProps = {
  success: boolean;
  title: string;
};

export function Message({ success, title }: MessageProps) {
  const message = success ? `${title} successfully` : title;

  if (success) {
    return (
      <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 shadow-md">
      <div className="flex items-start">
    
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}