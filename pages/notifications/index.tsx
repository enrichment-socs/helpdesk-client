import { BellIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  notificationsAtom,
  notificationsCountAtom,
  unreadNotificationsCountAtom,
} from '../../atom';
import NotificationItem from '../../components/notifications/NotificationItem';
import { SessionUser } from '../../models/SessionUser';
import { NotificationService } from '../../services/NotificationService';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

const NotificationPage: NextPage = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useAtom(
    unreadNotificationsCountAtom
  );

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const notifService = new NotificationService(user?.accessToken);
  const [isLoading, setIsLoading] = useState(false);

  const markAllAsRead = async () => {
    const message = 'Are you sure you want to mark all notifications as read?';
    if (await confirm(message)) {
      setIsLoading(true);
      await toast.promise(notifService.markAllAsRead(), {
        loading: 'Marking unread notifications as read',
        success: () => {
          setIsLoading(false);
          return 'Marked all notifications as read';
        },
        error: (e) => {
          console.log(e);
          setIsLoading(false);
          return 'Something is wrong when marking unread notifications as read, please contact developer';
        },
      });

      const refetchedNotifs = await notifService.getNotificationsByUser();
      setNotifications(refetchedNotifs.notifications);
      setUnreadNotificationsCount(refetchedNotifs.unreadCount);
    }
  };

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
              disabled={isLoading}
              title="Mark all as read"
              onClick={markAllAsRead}
              className={`flex items-center shadow text-white py-2 px-3 rounded text-sm ${
                isLoading
                  ? 'bg-green-400 text-gray-600'
                  : 'bg-green-600 hover:bg-green-700'
              }`}>
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
