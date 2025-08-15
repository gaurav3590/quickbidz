export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  ACTIVATE_ACCOUNT: "/activate-account",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  AUCTIONS: "/auctions",
  CREATE_AUCTION: "/auctions/create",
  BIDS: "/bids",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
  ROUTES.ACTIVATE_ACCOUNT,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.AUCTIONS,
  ROUTES.CREATE_AUCTION,
  ROUTES.BIDS,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
