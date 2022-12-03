import { BellIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  notificationsAtom,
  notificationsCountAtom,
  unreadNotificationsCountAtom,
} from '../atom';
import NotificationItem from '../components/notifications/NotificationItem';
import { SessionUser } from '../models/SessionUser';
import { NotificationService } from '../services/NotificationService';
import { confirm } from '../shared/libs/confirm-dialog-helper';

const NavbarNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [notificationsCount] = useAtom(notificationsCountAtom);
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
    <div className="relative">
      <button
        onClick={() => setShowNotification(!showNotification)}
        className="hover:text-primary relative h-full">
        <span className="text-xs absolute top-1 -right-2 text-white rounded-full bg-primary px-1">
          {unreadNotificationsCount}
        </span>
        <BellIcon className="w-5 h-5" />
      </button>

      <section
        className={`absolute z-10 top-12 w-[28rem] right-0 bg-white border shadow transition-all ${
          showNotification ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <div className="flex justify-between items-center border-b">
          <div className="flex">
            <div className="border-l-4 border-primary"></div>
            <div className="m-3 text-sm font-medium">Notifications</div>
          </div>

          <div className="flex space-x-2 mr-2">
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              className={`shadow text-white py-1 px-3 rounded text-sm ${
                isLoading
                  ? 'bg-gray-400 text-gray-600'
                  : 'bg-green-600 hover:bg-green-700'
              }`}>
              <CheckCircleIcon className="w-4 h-4" />
            </button>
            <Link href="/notifications" passHref>
              <button
                title="View all"
                className="shadow text-white bg-primary hover:bg-primary-dark py-1 px-3 rounded text-sm">
                View All
              </button>
            </Link>
          </div>
        </div>

        <ul className="max-h-[20rem] overflow-auto">
          {notifications?.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} />
            </li>
          ))}

          {notifications?.length === 0 && (
            <li className="p-4 text-sm">You have no notifications.</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default NavbarNotification;
