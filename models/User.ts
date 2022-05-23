import { Role } from './Role';

export interface User {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  role: Role;
}
