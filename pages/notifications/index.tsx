import { BellIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { notificationsAtom, unreadNotificationsCountAtom } from '../../atom';
import NotificationItem from '../../components/notifications/NotificationItem';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

const NotificationPage: NextPage = () => {
  const [notifications] = useAtom(notificationsAtom);
  const [unreadNotificationsCount] = useAtom(unreadNotificationsCountAtom);

  return (
    <Layout>
      <div className={`ml-2 mt-5 border-2 rounded divide-y transition`}>
        <div className="p-2 flex justify-between items-center">
          <div className="text-lg font-bold flex items-center">
            <BellIcon className="h-5 w-5" />
            <span className="ml-3">Notifications</span>
            <small className="text-xs font-normal ml-2 bg-gray-300 rounded-full py-1 px-2">
              {unreadNotificationsCount} unread
            </small>
          </div>

          <div>
            <button
              title="Mark all as read"
              className="flex items-center shadow text-white bg-green-600 hover:bg-green-700 py-2 px-3 rounded text-sm">
              <div>Mark all as Read</div>{' '}
              <CheckCircleIcon className="ml-2 w-4 h-4" />
            </button>
          </div>
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
