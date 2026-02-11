type MessageProps = {
  success: boolean;
  title: string;
};

export function Message({ success, title }: MessageProps) {
  const message = success
    ? `${title} successfully `
    : title; 
  const baseClass = "mb-6 rounded-md px-4 py-3 text-sm font-medium border";

  const classNames = success
    ? `${baseClass} bg-green-100 text-green-700 border-green-300`
    : `${baseClass} bg-red-100 text-red-700 border-red-300`;

  return <div className={classNames}>{message}</div>;
}
