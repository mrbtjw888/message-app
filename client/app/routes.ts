import {
  type RouteConfig,
  route,
  index,
  layout,

} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("account", "routes/account.tsx"),
  route(":username", "routes/user.tsx"),
  route(":username/status/:statusId", "routes/status.tsx"),
  route(":username/liked", "routes/user-liked.tsx")

  // layout("layout/auth.tsx", [
  //   route("login", "./auth/login.tsx"),
  //   route("register", "./auth/register.tsx"),
  // ]),
] satisfies RouteConfig;
