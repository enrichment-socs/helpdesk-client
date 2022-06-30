import { Role } from './Role';

export interface User {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  jobTitle?: string;
  companyName?: string;
  officeLocation?: string;
  role: Role;
}
