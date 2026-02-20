import {
  type RouteConfig,
  route,
  index,
  layout,

} from "@react-router/dev/routes";

export default [
  route("/.well-known/*", "routes/well-known.tsx"),
  layout("layout/AppLayout.tsx", [
    index("routes/index.tsx"),
    route("account", "routes/account.tsx"),
    route("users/:username", "routes/user.tsx"),
    route("users/:username/likes", "routes/user-likes.tsx"),
    route("message/:messageId", "routes/message.tsx"),
    route("message/create", "routes/create-message.tsx")
  ]),

  layout("layout/AuthLayout.tsx", [
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),

  ])

] satisfies RouteConfig;
