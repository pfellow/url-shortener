import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  //   request.customIp = 'SOME_IP';
  //   console.log('MIDDLEWARE:' + request);
  //   return NextResponse.next();
  return new Response('Middleware!');
}

export const config = {
  matcher: '/*'
};
