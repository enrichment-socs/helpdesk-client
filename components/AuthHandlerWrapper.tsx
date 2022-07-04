import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { SessionUser } from '../models/SessionUser';

export default function AuthHandlerWrapper() {
  const clientSession = useSession();
  useEffect(() => {
    const user = clientSession?.data?.user as SessionUser;
    if (user) {
      const tokenPayload: any = jwt_decode(user.accessToken);
      const expDate = new Date(tokenPayload.exp * 1000);
      const now = new Date();
      if (now >= expDate)
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_LOGIN_ABSOLUTE_URL });
    }
  }, [clientSession]);

  return <></>;
}
