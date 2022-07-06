import { Category } from './Category';
import { Priority } from './Priority';
import { Semester } from './Semester';
import { Status } from './Status';
import { TicketStatus } from './TicketStatus';
import { User } from './User';

export class Ticket {
  id: string;
  conversationId: string;
  public assignedTo: User;
  public semester: Semester;
  public status: Status;
  public category: Category;
  public priority: Priority;
  ticketStatuses: TicketStatus[];
  senderName: string;
  senderEmail: string;
  subject: string;
  dueBy: string;
  created_at: string;
  updated_at: string;
}

export class TicketFilterModel {
  priority: string;
  status: string;
  query: string;
}
