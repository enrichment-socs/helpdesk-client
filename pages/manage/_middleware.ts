import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();

  const session = await getToken({ req: req as any });
  if (!session) {
    url.pathname = '/auth/login';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
