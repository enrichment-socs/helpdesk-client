import { IncomingMessage } from 'http';
import { Session } from 'next-auth';
import { GetSessionParams } from 'next-auth/react';
import { Semester } from '../../models/Semester';
import { SemesterService } from '../../services/SemesterService';

type Props = {
  session: Session;
  semesters: Semester[];
  sessionActiveSemester: Semester;
};

/* Should only be called from GetServerSideProps in a page */
export const getInitialServerProps = async (
  req: IncomingMessage,
  getSession: (params?: GetSessionParams) => Promise<Session | null>,
  semesterService: SemesterService
): Promise<Props> => {
  const semesters = await semesterService.getSemesters();
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
