export interface CreateUserDto {
  code: string;
  email: string;
  name: string;
  department: string;
  roleId: string;
  jobTitle?: string;
  companyName?: string;
  officeLocation?: string;
}
