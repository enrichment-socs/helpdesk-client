import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { useHydrateAtoms } from 'jotai/utils';
import { semestersAtom, activeSemesterAtom } from '../atom';
import { Semester } from '../models/Semester';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { semesters }: { semesters: Semester[] } = pageProps;
  const [activeSemester, setActiveSemester] = useAtom(activeSemesterAtom);

  if (semesters) {
    useHydrateAtoms([[semestersAtom, semesters]]);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!activeSemester) setActiveSemester(semesters.find((s) => s.isActive));
    }
  }, []);

  return (
    <>
      <NextNProgress />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
