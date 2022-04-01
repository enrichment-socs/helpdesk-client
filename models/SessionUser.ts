import { Role } from './Role';

export class SessionUser {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  role: Role;
}
