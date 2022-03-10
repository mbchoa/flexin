import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>flexin | A push-up a day</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
