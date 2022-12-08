export class TicketHistoryUpdatedData {
  createdBy: string;
  dueByChanged?: {
    from: string;
    to: string;
    reason?: string;
  };
  statusChanged?: {
    from: string;
    to: string;
  };
  senderNameChanged?: {
    from: string;
    to: string;
  };
  senderEmailChanged?: {
    from: string;
    to: string;
  };
}
