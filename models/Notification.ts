export class Notification {
  id: string;
  title: string;
  data: string;
  isRead: boolean;
  type:
    | 'TicketAssigned'
    | 'TicketDueDateReminder'
    | 'TicketPendingReminder'
    | 'TicketDueDateChanged'
    | 'TicketStatusChanged';
  created_at: string;
  updated_at: string;
  deletedAt: string | null;
}

export class TicketAssignedNotification {
  ticketId: string;
  number: string;
  subject: string;
  priority: string;
  dueDate: string;
  semester: string;
  category: string;
}

export class TicketDueDateReminderNotification {
  ticketId: string;
  number: string;
  subject: string;
  dueDate: string;
}

export class TicketDueDateUpdatedNotification {
  ticketId: string;
  number: string;
  subject: string;
  fromDate: string;
  toDate: string;
  reason: string;
}

export class TicketPendingReminderNotification {
  ticketId: string;
  number: string;
  subject: string;
}

export interface TicketStatusChangedNotification {
  ticketId: string;
  number: string;
  subject: string;
  from: string;
  to: string;
}
