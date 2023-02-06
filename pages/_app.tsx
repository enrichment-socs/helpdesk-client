import '../shared/styles/globals.css';
import type { AppProps } from 'next/app';
import { useHydrateAtoms } from 'jotai/utils';
import {
  semestersAtom,
  activeSemesterAtom,
  notificationsAtom,
  notificationsCountAtom,
  unreadNotificationsCountAtom,
} from '../atom';
import { Semester } from '../models/Semester';
import { SessionProvider } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
import AuthHandlerWrapper from '../components/AuthHandlerWrapper';
import { Notification } from '../models/Notification';
import useHydrateAndSyncAtom from '../hooks/useHydrateAndSyncAtom';
import { useSetAtom } from 'jotai';
import dynamic from 'next/dynamic';

const NextNProgress = dynamic(() => import('nextjs-progressbar'));
const Toaster = dynamic(() => import('react-hot-toast').then((t) => t.Toaster));

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
  useHydrateAndSyncAtom([
    [notificationsAtom, useSetAtom(notificationsAtom), notifications],
    [
      notificationsCountAtom,
      useSetAtom(notificationsCountAtom),
      notificationsCount,
    ],
    [
      unreadNotificationsCountAtom,
      useSetAtom(unreadNotificationsCountAtom),
      unreadNotificationsCount,
    ],
  ]);

  useHydrateAtoms([
    [semestersAtom, semesters],
    [activeSemesterAtom, sessionActiveSemester],
  ] as const);

  return (
    <>
      <NextNProgress />
      <SessionProvider session={session} /*basePath="/helpdesk/api/auth" */>
        <AuthHandlerWrapper />
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
