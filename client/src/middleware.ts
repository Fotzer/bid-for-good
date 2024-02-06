import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    const redirectUrl = new URL("/auctions", req.url);

    return NextResponse.redirect(redirectUrl);
  }

  if (req.nextUrl.pathname.startsWith("/sign-in")) {
    // const token = await getToken({ req });
    const token = false;

    if (token) {
      const redirectUrl = new URL("/auctions", req.url);

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}
