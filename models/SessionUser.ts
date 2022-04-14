export class SessionUser {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  roleId: string;
  roleName: string;
  accessToken: string;
  refreshToken: string;
  exp: number;
  iat: number;
}
