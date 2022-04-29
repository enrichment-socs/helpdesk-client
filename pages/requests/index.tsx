import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import RequestsTable from '../../components/requests/RequestsTable';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemestersService } from '../../services/SemestersService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';

const RequestsHeaderPage: NextPage = () => {
  return (
    <Layout>
      <RequestsTable />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN, ROLES.USER]))
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

export default RequestsHeaderPage;
