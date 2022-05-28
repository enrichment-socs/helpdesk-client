import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import RequestsTable from '../../components/requests/RequestsTable';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemesterService } from '../../services/SemesterService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';
import { atom } from 'jotai';
import { Case } from '../../models/Case';
import { useHydrateAtoms } from 'jotai/utils';
import { CaseService } from '../../services/CaseService';
import { SessionUser } from '../../models/SessionUser';

export const casesAtom = atom([] as Case[]);

type Props = {
  currCases: Case[];
};

const RequestsHeaderPage: NextPage<Props> = ({ currCases }) => {

  useHydrateAtoms([[casesAtom, currCases]] as const);

  return (
    <Layout>
      <RequestsTable cases={currCases} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN, ROLES.USER]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session.user as SessionUser;
    const caseService = new CaseService(user?.accessToken);
    const currCases = await caseService.getCases();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currCases,
      },
    };
  }
);

export default RequestsHeaderPage;
