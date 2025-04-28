import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const privatePaths = ['/dashboard', '/settings'];
const unprotectedPaths = ['/login', '/register'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isAuth = Boolean(req.cookies.get('refreshToken')?.value);

    if (privatePaths.some(path => pathname.startsWith(path)) && !isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (unprotectedPaths.some(path => pathname.startsWith(path)) && isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/settings/:path*'],
};