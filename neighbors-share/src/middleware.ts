export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/requests/:path*', '/items/new', '/messages/:path*', '/profile'],
};