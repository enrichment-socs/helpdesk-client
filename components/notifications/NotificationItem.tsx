import {
  BellIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from '@heroicons/react/outline';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Notification,
  TicketAssignedNotification,
  TicketDueDateReminderNotification,
  TicketDueDateUpdatedNotification,
  TicketPendingReminderNotification,
  TicketStatusChangedNotification,
} from '../../models/Notification';
import { SessionUser } from '../../models/SessionUser';
import { NotificationService } from '../../services/NotificationService';

type Props = {
  showSideList?: boolean;
  notification: Notification;
};

const NotificationItem = ({ showSideList = true, notification }: Props) => {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const notifService = new NotificationService(user?.accessToken);

  const renderContent = () => {
    let data = null;

    switch (notification.type) {
      case 'TicketAssigned':
        data = JSON.parse(notification.data) as TicketAssignedNotification;
        return (
          <div>
            <h4>
              Ticket {data.number ? <b>#{data.number}</b> : <></>} has been
              assigned to you.
            </h4>
            <p>
              Subject: <span className="font-medium">{data.subject}</span>
            </p>
            <p>
              Semester: <span className="font-medium">{data.semester}</span>
            </p>
            <p>
              Category: <span className="font-medium">{data.category}</span>
            </p>
            <p>
              Priority: <span className="font-medium">{data.priority}</span>
            </p>
            <p>
              Due date: <span className="font-medium">{data.dueDate}</span>
            </p>
          </div>
        );
      case 'TicketDueDateChanged':
        data = JSON.parse(
          notification.data
        ) as TicketDueDateUpdatedNotification;
        return (
          <div>
            <h4>
              Ticket {data.number ? <b>#{data.number}</b> : <></>} due date has
              been updated.
            </h4>
            {data.subject && (
              <p>
                Subject: <span className="font-medium">{data.subject}</span>
              </p>
            )}
            <p>
              From{' '}
              <span className="font-medium">
                {format(new Date(data.fromDate), 'MMM dd, yyyy HH:mm')}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {format(new Date(data.toDate), 'MMM dd, yyyy HH:mm')}
              </span>
            </p>

            <p>
              Reason: <span className="font-medium">{data.reason}</span>
            </p>
          </div>
        );
      case 'TicketStatusChanged':
        data = JSON.parse(notification.data) as TicketStatusChangedNotification;
        return (
          <div>
            <h4>
              Ticket {data.number ? <b>#{data.number}</b> : <></>} status has
              been changed.
            </h4>
            {data.subject && (
              <p>
                Subject: <span className="font-medium">{data.subject}</span>
              </p>
            )}
            <p>
              From <span className="font-medium">{data.from}</span> to{' '}
              <span className="font-medium">{data.to}</span>
            </p>
            {data.reason && (
              <p>
                Reason: <span className="font-medium">{data.reason}</span>
              </p>
            )}
          </div>
        );
      case 'TicketDueDateReminder':
        break;
      case 'TicketPendingReminder':
        break;
    }
    return <div>No data to be displayed.</div>;
  };

  const onClick = async () => {
    switch (notification.type) {
      case 'TicketAssigned':
      case 'TicketDueDateReminder':
      case 'TicketPendingReminder':
      case 'TicketStatusChanged':
      case 'TicketDueDateChanged':
        const data = JSON.parse(notification.data) as { ticketId: string };
        await toast.promise(notifService.markAsRead(notification.id), {
          loading: 'Marking as read...',
          success: () => {
            router.push(`/tickets/${data.ticketId}`);
            return 'Redirecting...';
          },
          error: (e) => {
            console.error(e);
            return 'Something is wrong when marking this notification as read, please contact developer';
          },
        });
    }
  };

  const renderIcon = () => {
    switch (notification.type) {
      case 'TicketAssigned':
        return <BookOpenIcon className="w-7 h-7" />;
      case 'TicketDueDateReminder':
      case 'TicketStatusChanged':
        return <ClipboardListIcon className="w-7 h-7" />;
      case 'TicketPendingReminder':
      case 'TicketDueDateChanged':
        return <BellIcon className="w-7 h-7" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex border-t cursor-pointer hover:bg-gray-100">
      {showSideList && <div className="border-l-4 border-primary"></div>}
      <div className="flex relative justify-center p-4">
        {renderIcon()}
        {!notification.isRead && (
          <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-primary"></div>
        )}
      </div>
      <div className="w-full mr-4 my-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold block">{notification.title}</span>
          <small className="block">
            {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
          </small>
        </div>

        <div className="flex">
          <div className="text-xs mt-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
