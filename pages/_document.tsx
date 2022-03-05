import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Daily push-up challenge tracker" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        {/* <meta name="twitter:url" content="https://flexin.vercel.app" /> */}
        <meta name="twitter:title" content="flexin | A push-up a day" />
        <meta
          name="twitter:description"
          content="Daily push-up challenge tracker"
        />
        {/* <meta name="twitter:image" content="https://flexin.vercel.app/alarm-clock.png" /> */}
        <meta name="twitter:creator" content="@mibrychoa" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="flexin | A push-up a day" />
        <meta property="og:description" content="" />
        <meta property="og:site_name" content="jotjik" />
        {/* <meta property="og:url" content="https://flexin.vercel.app" /> */}
        {/* <meta property="og:image" content="https://flexin.vercel.app/alarm-clock.png" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
