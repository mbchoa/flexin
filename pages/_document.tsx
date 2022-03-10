import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Daily push-up challenge tracker" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://flexin.one" />
        <meta name="twitter:title" content="flexin | A push-up a day" />
        <meta
          name="twitter:description"
          content="Daily push-up challenge tracker"
        />
        <meta name="twitter:creator" content="@mibrychoa" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="flexin | A push-up a day" />
        <meta property="og:description" content="" />
        <meta property="og:site_name" content="flexin" />
        <meta property="og:url" content="https://flexin.one" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
