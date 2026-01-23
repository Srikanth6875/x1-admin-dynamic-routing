import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/auth.layout.tsx",
    children: [
      index("routes/home.tsx"),
      route("login", "routes/login.tsx"),
      route("logout", "routes/logout.tsx"),
    ],
  },
  {
    path: "/list",
    file: "routes/admin.layout.tsx",
    children: [
      route(":app-type/:run-type", "routes/admin.listing.tsx"),
    ],
  },
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
