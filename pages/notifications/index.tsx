import { BellIcon } from '@heroicons/react/outline';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { notificationsAtom } from '../../atom';
import NotificationItem from '../../components/notifications/NotificationItem';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

const NotificationPage: NextPage = () => {
  const [notifications] = useAtom(notificationsAtom);

  return (
    <Layout>
      <div className={`ml-2 mt-5 border-2 rounded divide-y transition`}>
        <div className="text-lg p-2 font-bold flex items-center">
          <BellIcon className="h-5 w-5" />
          <span className="ml-3">Notifications</span>
        </div>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem
                notification={notification}
                showSideList={false}
              />
            </li>
          ))}

          {notifications.length === 0 && (
            <li className="p-4 text-center">
              You currently have no notifications.
            </li>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

    if (!session)
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
