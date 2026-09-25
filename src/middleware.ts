import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_HOST = "www.phuketpoleretreats.com";

/**
 * Keep non-production hosts (the *.vercel.app deployment URL, preview builds,
 * anything that is not the canonical www domain) out of search engines so they
 * cannot compete with the real site as duplicate content. The production host
 * is unaffected and stays fully indexable.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const isProduction = host === PRODUCTION_HOST;
  const response = NextResponse.next();
  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  // Run on all pages; skip Next internals and static assets for speed.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
