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
        path: "/",
        file: "routes/admin.layout.tsx",
        children: [
            route("list/:app-type/:run-type", "routes/admin.listing.tsx"),
            route("forms/:app-type/:run-type", "routes/admin.forms.tsx"),
            route("details/:app-type/:run-type", "routes/admin.details.tsx"),
        ],
    },

//       {
//     path: "/",
//     file: "routes/admin.layout.tsx",
//     children: [
//       // ONE route handles: list, forms, details, delete,
//       // wizard, dashboard, report — anything future too.
//       // The backend component_type decides what renders.
//       route("app/:app-type/:run-type", "routes/admin.app.tsx"),

//       // Dedicated action-only route (no UI) for inline table edits
//       route("actions/inline-edit", "routes/actions/inline-edit.tsx"),
//     ],
//   },

    route("actions/inline-edit", "routes/actions/inline-edit.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

