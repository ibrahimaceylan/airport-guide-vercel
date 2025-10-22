import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";

const locales = ["en", "tr", "ar"] as const;

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

const DASHBOARD_ROOT = "/dashboard";
const DASHBOARD_ADMIN = "/dashboard/admin";
const DASHBOARD_EDITOR = "/dashboard/editor";
const DASHBOARD_CONTENT = "/dashboard/admin/content";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];
  const locale = locales.includes(possibleLocale as (typeof locales)[number])
    ? possibleLocale
    : undefined;
  const normalizedPath =
    locale && segments.length > 1 ? `/${segments.slice(1).join("/")}` : locale ? "/" : pathname;

  // 🔒 Protect dashboard routes
  if (normalizedPath.startsWith(DASHBOARD_ROOT)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = token?.role as string | undefined;
    const localePrefix = locale ? `/${locale}` : "";

    if (!role) {
      const loginUrl = new URL(`${localePrefix}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Editor access to /dashboard/admin/content
    if (normalizedPath.startsWith(DASHBOARD_CONTENT)) {
      if (role !== "ADMIN" && role !== "EDITOR") {
        const loginUrl = new URL(`${localePrefix}/login`, req.url);
        return NextResponse.redirect(loginUrl);
      }
    }
    // Editors trying to access admin dashboard
    else if (normalizedPath.startsWith(DASHBOARD_ADMIN) && role !== "ADMIN") {
      const editorRedirect = new URL(`${localePrefix}${DASHBOARD_EDITOR}`, req.url);
      return NextResponse.redirect(editorRedirect);
    }
  }

  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(en|tr|ar)/:path*", "/dashboard/:path*"],
};
