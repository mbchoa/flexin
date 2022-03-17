import React, { FormEvent, useCallback, useState } from 'react';
import type { NextPageContext, NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Profile } from '@prisma/client';

import { prisma } from 'lib/prisma';

import ProgressGrid from 'components/ProgressGrid';

interface Props {
  profile: Profile;
}

const Home: NextPage<Props> = ({ profile }) => {
  const router = useRouter();
  const [currentDay, setCurrentDay] = useState(profile.currentDay);
  const [startDate, setStartDate] = useState(profile.startDate);

  const hasStartedRoutine = startDate && new Date(startDate) <= new Date();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!hasStartedRoutine) {
        // update profile start date to today's date
        await fetch(`/api/profile/${profile.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: new Date().toISOString(),
          }),
        });
      }

      router.push(`/day/${currentDay + 1}`);
    },
    [currentDay, hasStartedRoutine, router, profile.id]
  );

  const handleRestart = useCallback(async () => {
    await fetch(`/api/profile/${profile.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentDay: 0,
        startDate: null,
      }),
    });
    setCurrentDay(0);
    setStartDate(null);
  }, [profile.id]);

  return (
    <div>
      <Head>
        <title>flexin | A push-up a day</title>
      </Head>
      <main className="flex items-center justify-center h-screen flex-col px-4 sm:px-0">
        <form
          className="bg-white shadow-md rounded p-6 flex flex-col w-full max-w-xs space-y-4"
          onSubmit={handleSubmit}
        >
          {hasStartedRoutine ? (
            <h1>Day: {currentDay + 1}</h1>
          ) : (
            <h1>Let&apos;s get started!</h1>
          )}
          {hasStartedRoutine && <ProgressGrid currentDay={currentDay} />}
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors"
            type="submit"
          >
            {hasStartedRoutine ? 'Continue' : 'Start!'}
          </button>
          {hasStartedRoutine && (
            <button
              className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 transition-colors"
              type="button"
              onClick={handleRestart}
            >
              Restart
            </button>
          )}
        </form>
      </main>
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

  // find user based on email
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    // TODO: we're in a weird place here where the user was not created yet despite being authenticated
    return { props: {} };
  }

  // create new profile if it doesn't exist
  const profile = await prisma.profile.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default Home;
