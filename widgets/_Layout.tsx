import Head from 'next/head';
import { CSSProperties } from 'react';
import Navbar from './_Navbar';

type Props = {
  children: any;
  withNavbar?: boolean;
  className?: string;
  controlWidth?: boolean;
  style?: CSSProperties;
};

export default function Layout({
  children,
  withNavbar,
  className,
  controlWidth,
  style,
}: Props) {
  withNavbar = withNavbar ?? true;
  controlWidth = controlWidth ?? true;
  style = style ?? {};

  return (
    <div>
      <Head>
        <title>Enrichment SoCS Helpdesk</title>
        <meta name="description" content="Enrichment SoCS Consultation App" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      {withNavbar && <Navbar />}

      <main
        style={style}
        className={`min-h-screen ${
          controlWidth
            ? 'max-w-screen-2xl px-2 sm:px-6 lg:px-8 mx-auto mb-8'
            : ''
        } ${className ?? ''}`}>
        {children}
      </main>
    </div>
  );
}
