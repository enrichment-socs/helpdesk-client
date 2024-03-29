import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import {
  AST_INITIAL_REGEX,
  EMPLOYEE_EMAIL_REGEX,
  STUDENT_EMAIL_REGEX,
  STUDENT_NUMBER_REGEX,
  ADMIN_USERNAME,
} from '../../../shared/constants/regex';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      const payload = jwt_decode(token.accessToken);

      token.iat = payload.iat;
      token.exp = payload.exp;
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url
      return url;
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
            !AST_INITIAL_REGEX.test(username) &&
            username !== ADMIN_USERNAME
          ) {
            throw new Error('Username must be a valid NIM or Binus Email');
          }

          const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
          const result = await axios.post(`${apiUrl}/auth`, {
            username,
            password,
          });
          const { access_token } = result.data;
          const payload = jwt_decode(access_token);

          return {
            ...payload,
            accessToken: access_token,
          };
        } catch (e) {
          throw new Error(e.response.data.message);
        }
      },
    }),
  ],
});
