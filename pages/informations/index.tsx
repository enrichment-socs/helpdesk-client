import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { SemesterService } from '../../services/SemesterService';
import { ROLES } from '../../shared/constants/roles';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

const InformationsPage: NextPage = () => {
  return <Layout>Informations</Layout>;
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default InformationsPage;
