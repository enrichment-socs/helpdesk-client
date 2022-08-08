import { Role } from './Role';

export class Announcement {
  id: string;
  title: string;
  body: string;
  startDate: Date;
  endDate: Date;
  role: Role | null;
}
