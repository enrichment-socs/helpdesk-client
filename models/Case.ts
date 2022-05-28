import { Category } from './Category';
import { Semester } from './Semester';
import { Status } from './Status';
import { User } from './User';

export class Case {
  id: string;
  conversationId: string;
  public assignedTo: User;
  public semester: Semester;
  public status: Status;
  public category: Category;
  senderName: string;
  senderEmail: string;
  subject: string;
  dueBy: string;
  created_at: string;
  updated_at: string;
}
