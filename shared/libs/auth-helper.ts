import { Session } from 'next-auth';
import { SessionUser } from '../../models/SessionUser';

export const AuthHelper = {
  isLoggedInAndHasRole(session: Session, allowedRoles: string[]) {
    if (!session) return false;
    const user = session.user as SessionUser;
    if (!user) return false;
    if (!allowedRoles.includes(user.roleName)) return false;
    return true;
  },
};
