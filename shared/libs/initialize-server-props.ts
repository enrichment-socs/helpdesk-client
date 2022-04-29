import { IncomingMessage } from 'http';
import { Session } from 'next-auth';
import { GetSessionParams } from 'next-auth/react';
import { Semester } from '../../models/Semester';
import { SemestersService } from '../../services/SemestersService';

type Props = {
  session: Session;
  semesters: Semester[];
  sessionActiveSemester: Semester;
};

/* Should only be called from GetServerSideProps in a page */
export const getInitialServerProps = async (
  req: IncomingMessage,
  getSession: (params?: GetSessionParams) => Promise<Session | null>,
  semesterService: SemestersService
): Promise<Props> => {
  const semesters = await Object.getPrototypeOf(
    semesterService
  ).constructor.getSemesters();
  const session = await getSession({ req });
  const dbActiveSemester = semesters.find((s) => s.isActive);
  const activeSemester = req.session.activeSemester ?? dbActiveSemester;

  if (!req.session.activeSemester) {
    req.session.activeSemester = dbActiveSemester;
    await req.session.save();
  }

  return {
    session,
    semesters,
    sessionActiveSemester: activeSemester,
  };
};
