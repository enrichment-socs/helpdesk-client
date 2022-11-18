export class Notification {
  id: string;
  title: string;
  data: string;
  isRead: boolean;
  type:
    | 'TicketAssigned'
    | 'TicketDueDateReminder'
    | 'TicketPendingReminder'
    | 'TicketStatusChanged';
  created_at: string;
  updated_at: string;
  deletedAt: string | null;
}

export class TicketAssignedNotification {
  ticketId: string;
  subject: string;
  priority: string;
  dueDate: string;
  semester: string;
  category: string;
}

export class TicketDueDateReminderNotification {
  ticketId: string;
  dueDate: string;
}

export class TicketPendingReminderNotification {
  ticketId: string;
}

export interface TicketStatusChangedNotification {
  ticketId: string;
  from: string;
  to: string;
}
