import { User } from './User';
import { Ticket } from './Ticket';
import { Status } from './Status';

export class TicketStatus {
  id: string;
  ticket: Ticket;
  status: Status;
  user: User;
  reason: string;
  created_at: Date;
}
