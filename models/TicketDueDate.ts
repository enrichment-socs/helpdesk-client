import { Ticket } from './Ticket';
import { User } from './User';

export class TicketDueDate {
  id: string;
  ticket: Ticket;
  user: User;
  public dueDate: Date;
  public reason: string;
  public created_at: Date;
  public deletedAt: Date;
}
