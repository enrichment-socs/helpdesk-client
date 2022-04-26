import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { SessionUser } from '../models/SessionUser';

export class BaseService {
  protected static BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  protected static BINUS_BASE_URL: string =
    process.env.NEXT_PUBLIC_BINUS_BASE_API_URL!;
  protected static DIVISON_ID: string = process.env.NEXT_PUBLIC_DIVISON_ID!;
  protected static BINUSMAYA_LOGIN_API_URL =
    process.env.NEXT_PUBLIC_BINUSMAYA_LOGIN_API!;

  protected static headersWithToken(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
