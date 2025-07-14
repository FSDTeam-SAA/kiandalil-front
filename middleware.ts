import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const normalizedPath =
        pathname.endsWith("/") && pathname.length > 1
            ? pathname.slice(0, -1)
            : pathname;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/public") ||
        /\.(.*)$/.test(pathname)
    ) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log(token)

    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const publicAuthPages = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-email",
        "/reset-password",
    ];
    if (token && publicAuthPages.includes(normalizedPath)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    if (pathname.startsWith("/dashboard") && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
    ],
};
