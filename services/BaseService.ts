import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { SessionUser } from '../models/SessionUser';
import { PromiseWrapper } from '../shared/libs/promise-wrapper';

export class BaseService {
  protected BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

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
