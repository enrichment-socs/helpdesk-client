import { IncomingMessage } from 'http';
import { Session } from 'next-auth';
import { getSession, GetSessionParams } from 'next-auth/react';
import { Semester } from '../../models/Semester';
import { SemesterService } from '../../services/SemesterService';
import jwt_decode from 'jwt-decode';
import { SessionUser } from '../../models/SessionUser';
import { NotificationService } from '../../services/NotificationService';
import { Notification } from '../../models/Notification';

type Props = {
  session: Session;
  semesters: Semester[];
  notifications: Notification[];
  notificationsCount: number;
  sessionActiveSemester: Semester;
};

/* Should only be called from GetServerSideProps in a page */
export const getInitialServerProps = async (
  req: IncomingMessage
): Promise<Props> => {
  const semesterService = new SemesterService();
  const semesters = await semesterService.getSemesters();
  const dbActiveSemester = semesters.find((s) => s.isActive);
  let session = await getSession({ req });
  let activeSemester = req.session.activeSemester ?? dbActiveSemester;
  const user = session.user as SessionUser | null;

  const notifService = new NotificationService(user ? user.accessToken : '');
  const { notifications, count } = user
    ? await notifService.getNotificationsByUser()
    : { notifications: [], count: 0 };

  if (!req.session.activeSemester) {
    req.session.activeSemester = dbActiveSemester;
    await req.session.save();
  } else {
    if (!semesters.find((s) => s.id === req.session.activeSemester.id)) {
      activeSemester = dbActiveSemester;
      req.session.activeSemester = dbActiveSemester;
      await req.session.save();
    }
  }

  if (session) {
    const user = session?.user as SessionUser;
    const payload: any = jwt_decode(user?.accessToken);
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    if (now >= expDate) session = null;
  }

  return {
    session,
    semesters,
    notifications,
    notificationsCount: count,
    sessionActiveSemester: activeSemester ?? null, // handle undefined
  };
};
