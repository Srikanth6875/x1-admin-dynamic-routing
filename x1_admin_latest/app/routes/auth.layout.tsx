import { isRouteErrorResponse, Outlet, useRouteError } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: 40 }}>
        <h1>
          {error.status} - {error.statusText}
        </h1>
        <pre>{JSON.stringify(error.data, null, 2)}</pre>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Unexpected Error</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return <h1>Unknown error occurred</h1>;
}
