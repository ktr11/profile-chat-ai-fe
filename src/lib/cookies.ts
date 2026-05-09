import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 2592000,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
}
