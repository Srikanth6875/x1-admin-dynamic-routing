import { Link } from "react-router";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>

      <Link to="/" style={{ marginTop: "1rem", display: "inline-block" }}>
        Go back home
      </Link>
    </div>
  );
}
