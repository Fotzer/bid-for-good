import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    let redirectUrl = new URL("/auctions", req.url);

    if (req.nextUrl.searchParams.get("redirectTo")) {
      redirectUrl = new URL(req.nextUrl.searchParams.get("redirectTo")!);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
