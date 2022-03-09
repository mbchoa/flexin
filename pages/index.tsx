import type { NextPageContext, NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>flexin | A push-up a day</title>
      </Head>

      <main>Testing</main>

      <footer>Footer</footer>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  // redirects to the signin page if no session exists
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
      },
    };
  }

  return { props: {} };
}

export default Home;
