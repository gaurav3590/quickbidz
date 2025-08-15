import * as CryptoJS from "crypto-js";
import Cookies from "js-cookie";

// Get environment variables
const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "quickbidz-secret-key";
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const TOKEN_KEY = "auth_tokens";

// Cookie names from environment variables
export const COOKIE_NAMES = {
  accessToken:
    process.env.NEXT_PUBLIC_COOKIE_ACCESS_TOKEN_KEY || "quickbids-at",
  refreshToken:
    process.env.NEXT_PUBLIC_COOKIE_REFRESH_TOKEN_KEY || "quickbids-rt",
  id: process.env.NEXT_PUBLIC_COOKIE_ID_KEY || "id",
  tenant: process.env.NEXT_PUBLIC_COOKIE_TENANT_KEY || "t",
};

// Encrypt token
export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt token
export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Set cookies
export const setAuthCookies = (tokens: AuthTokens) => {
  // Store tokens in cookies with appropriate options
  Cookies.set(TOKEN_KEY, JSON.stringify(tokens), {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

// Get cookie by name
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

// Get tokens from cookies
export const getAuthTokens = (): AuthTokens | null => {
  const tokens = Cookies.get(TOKEN_KEY);
  if (!tokens) return null;

  try {
    return JSON.parse(tokens) as AuthTokens;
  } catch (error) {
    console.error("Failed to parse auth tokens:", error);
    return null;
  }
};

// Clear auth cookies
export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_KEY);
};
