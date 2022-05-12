import '../shared/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { useHydrateAtoms } from 'jotai/utils';
import { semestersAtom, activeSemesterAtom } from '../atom';
import { Semester } from '../models/Semester';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
import AuthHandlerWrapper from '../components/AuthHandlerWrapper';

type GlobalProps = {
  semesters: Semester[];
  sessionActiveSemester: Semester;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { semesters, sessionActiveSemester }: GlobalProps = pageProps;
  useHydrateAtoms([
    [semestersAtom, semesters],
    [activeSemesterAtom, sessionActiveSemester],
  ] as const);

  return (
    <>
      <NextNProgress />
      <SessionProvider session={session}>
        <AuthHandlerWrapper />
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
