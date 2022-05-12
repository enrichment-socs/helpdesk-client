import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { SessionUser } from '../models/SessionUser';
import { PromiseWrapper } from '../shared/libs/promise-wrapper';

export class BaseService {
  protected BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  protected BINUS_BASE_URL: string =
    process.env.NEXT_PUBLIC_BINUS_BASE_API_URL!;
  protected DIVISON_ID: string = process.env.NEXT_PUBLIC_DIVISON_ID!;
  protected BINUSMAYA_LOGIN_API_URL =
    process.env.NEXT_PUBLIC_BINUSMAYA_LOGIN_API!;

  protected accessToken: string = '';
  protected wrapper: PromiseWrapper;

  protected headersWithToken = () => {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  };

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
    this.wrapper = new PromiseWrapper();
  }
}
