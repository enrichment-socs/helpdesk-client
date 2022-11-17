import '../shared/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { useHydrateAtoms } from 'jotai/utils';
import {
  semestersAtom,
  activeSemesterAtom,
  notificationsAtom,
  notificationsCountAtom,
  unreadNotificationsCountAtom,
} from '../atom';
import { Semester } from '../models/Semester';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
import AuthHandlerWrapper from '../components/AuthHandlerWrapper';
import { Notification } from '../models/Notification';

type GlobalProps = {
  semesters: Semester[];
  sessionActiveSemester: Semester;
  notifications: Notification[];
  notificationsCount: number;
  unreadNotificationsCount: number;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const {
    semesters,
    sessionActiveSemester,
    notifications,
    notificationsCount,
    unreadNotificationsCount,
  }: GlobalProps = pageProps;
  useHydrateAtoms([
    [notificationsAtom, notifications],
    [notificationsCountAtom, notificationsCount],
    [unreadNotificationsCountAtom, unreadNotificationsCount],
    [semestersAtom, semesters],
    [activeSemesterAtom, sessionActiveSemester],
  ] as const);

  return (
    <>
      <NextNProgress />
      <SessionProvider session={session} basePath="/helpdesk/api/auth">
        <AuthHandlerWrapper />
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
