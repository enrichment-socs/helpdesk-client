import { User } from './User';
import { Case } from './Case';
import { Status } from './Status';

export class CaseStatus {
  id: string;
  case: Case;
  status: Status;
  user: User;
  reason: string;
  created_at: Date;
}
