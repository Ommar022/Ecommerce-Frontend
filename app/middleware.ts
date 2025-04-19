import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const url = req.nextUrl.clone();
  
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/admin") && role !== "admin") {
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
