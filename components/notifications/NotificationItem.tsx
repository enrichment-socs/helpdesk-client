import { BellIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
  Notification,
  TicketAssignedNotification,
  TicketDueDateReminderNotification,
  TicketPendingReminderNotification,
  TicketStatusChangedNotification,
} from '../../models/Notification';

type Props = {
  showSideList?: boolean;
  notification: Notification;
};

const NotificationItem = ({ showSideList = true, notification }: Props) => {
  const router = useRouter();

  const renderContent = () => {
    switch (notification.type) {
      case 'TicketAssigned':
        const data = JSON.parse(
          notification.data
        ) as TicketAssignedNotification;
        return (
          <div>
            <h4>A new ticket has been assigned to you.</h4>
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
      case 'TicketDueDateReminder':
        break;
      case 'TicketPendingReminder':
        break;
      case 'TicketStatusChanged':
        break;
    }
    return <div>No data to be displayed.</div>;
  };

  const onClick = () => {
    switch (notification.type) {
      case 'TicketAssigned':
        const data = JSON.parse(
          notification.data
        ) as TicketAssignedNotification;
        return router.push(`/tickets/${data.ticketId}`);
      case 'TicketDueDateReminder':
      case 'TicketPendingReminder':
      case 'TicketStatusChanged':
        return;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex border-t cursor-pointer hover:bg-gray-100">
      {showSideList && <div className="border-l-4 border-primary"></div>}
      <div className="flex relative justify-center p-4">
        <BellIcon className="w-7 h-7" />
        {!notification.isRead && (
          <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-primary"></div>
        )}
      </div>
      <div className="w-full mr-4 my-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold block">{notification.title}</span>
          <small className="block">
            {format(new Date(notification.created_at), 'MMM dd, yyyy hh:mm')}
          </small>
        </div>

        <div className="flex">
          <div className="text-xs">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
