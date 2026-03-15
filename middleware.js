import { NextResponse } from "next/server";

export function middleware(request) {
  const host = request.headers.get("host") || "";
  // Redirect Vercel URL to custom domain so auth sessions are preserved
  if (host.includes("symbiosis-vault.vercel.app")) {
    const url = new URL(request.url);
    url.host = "vault.jackandjack.store";
    url.protocol = "https:";
    return NextResponse.redirect(url.toString(), 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons/).*)"],
};
