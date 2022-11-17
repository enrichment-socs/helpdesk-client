import { BellIcon } from '@heroicons/react/outline';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import NotificationItem from '../../components/notifications/NotificationItem';
import { SemesterService } from '../../services/SemesterService';
import { ROLES } from '../../shared/constants/roles';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

const NotificationPage: NextPage = () => {
  return (
    <Layout>
      <div className={`ml-2 mt-5 border-2 rounded divide-y transition`}>
        <div className="text-lg p-2 font-bold flex items-center">
          <BellIcon className="h-5 w-5" />
          <span className="ml-3">Notifications</span>
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6].map((notification) => (
            <NotificationItem showSideList={false} key={notification} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.ADMIN,
        ROLES.USER,
        ROLES.SUPER_ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default NotificationPage;
