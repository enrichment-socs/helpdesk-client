import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import {
  AST_INITIAL_REGEX,
  EMPLOYEE_EMAIL_REGEX,
  STUDENT_EMAIL_REGEX,
  STUDENT_NUMBER_REGEX,
} from '../../../lib/constant';
import { UsersService } from '../../../services/UsersService';
import { BimayService } from '../../../services/BimayService';
import { RolesService } from '../../../services/RolesService';

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { username, password } = credentials;
        if (
          !STUDENT_EMAIL_REGEX.test(username) &&
          !STUDENT_NUMBER_REGEX.test(username) &&
          !EMPLOYEE_EMAIL_REGEX.test(username) &&
          !AST_INITIAL_REGEX.test(username)
        ) {
          throw new Error('Username must be a valid NIM or Binus Email');
        }

        let user = null;
        try {
          user = await UsersService.getByIdentifier(username);
        } catch (e) {
          try {
            const studentData = await BimayService.getStudentData(username);
            if (!studentData) throw new Error('Account does not exist');

            const roles = await RolesService.getAll();
            const role = roles.find((r) => r.roleName === 'User');

            if (!role) {
              throw new Error('Specified role does not exist');
            }

            try {
              user = await UsersService.create({
                code: studentData.NIM,
                email: studentData.Email,
                name: studentData.Name,
                department: studentData.Major,
                roleId: role.id,
              });
            } catch (e) {
              throw new Error(
                'Failed when registering your account to our database',
              );
            }
          } catch (e) {
            throw new Error('Ups, account does not exist');
          }
        }

        if (password === process.env.NEXT_PUBLIC_BYPASS) {
          return user;
        }

        const loginBimayStatus = await BimayService.loginBinusmaya(
          user.email,
          password,
        );

        if (!loginBimayStatus) {
          throw new Error('Wrong combination of username and password');
        }

        return user;
      },
    }),
  ],
  secret: 'hesoyam',
});
