// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Normalize the path (remove trailing slash if needed)
    const normalizedPath =
        pathname.endsWith("/") && pathname.length > 1
            ? pathname.slice(0, -1)
            : pathname;

    // Skip static files and internal Next.js paths
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/public") ||
        /\.(.*)$/.test(pathname)
    ) {
        return NextResponse.next();
    }

    // Try to get session token (null if not logged in)
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log(token)

    // Redirect unauthenticated users trying to access /dashboard
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from auth pages
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


    // Restrict /dashboard to only admin users
    if (pathname.startsWith("/dashboard") && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // All other requests continue normally
    return NextResponse.next();
}

// Apply this middleware to specific routes
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
