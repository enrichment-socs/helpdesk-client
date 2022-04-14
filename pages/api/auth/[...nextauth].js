import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import {
  AST_INITIAL_REGEX,
  EMPLOYEE_EMAIL_REGEX,
  STUDENT_EMAIL_REGEX,
  STUDENT_NUMBER_REGEX,
} from '../../../lib/constant';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 1 * 60 * 60,
    strategy: 'jwt',
  },
  // jwt: {

  // }
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
        try {
          const { username, password } = credentials;
          if (
            !STUDENT_EMAIL_REGEX.test(username) &&
            !STUDENT_NUMBER_REGEX.test(username) &&
            !EMPLOYEE_EMAIL_REGEX.test(username) &&
            !AST_INITIAL_REGEX.test(username)
          ) {
            throw new Error('Username must be a valid NIM or Binus Email');
          }

          const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
          const result = await axios.post(`${apiUrl}/auth`, {
            username,
            password,
          });
          const { access_token, refresh_token } = result.data;
          const payload = jwt_decode(access_token);

          return {
            ...payload,
            accessToken: access_token,
            refreshToken: refresh_token,
          };
        } catch (e) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  secret: 'hesoyam',
});
