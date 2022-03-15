import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Profile } from '@prisma/client';

import { ROUTINE_SCHEDULE, PLANK, PUSHUP } from '../../constants';
import { NextPage, NextPageContext } from 'next';
import { Exercise, Workout } from 'index';
import { prisma } from 'lib/prisma';

interface Props {
  profile: Profile;
  workout?: Workout;
}

const WorkoutDay: NextPage<Props> = ({ profile, workout }) => {
  const [checkboxState, setcheckboxState] = useState(
    {} as Record<string, boolean>
  );
  const router = useRouter();
  const { day } = router.query;

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setcheckboxState({
        ...checkboxState,
        [event.target.name]: event.target.checked,
      });
    },
    [checkboxState]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await fetch(`/api/profile/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentDay: parseInt(day as string, 10),
        }),
      });
      // navigate back to the home page
      router.push('/');
    },
    [day, profile, router]
  );

  const renderRepsLabel = useCallback((type: Exercise, reps: number) => {
    if (type === PUSHUP) {
      return `${reps} push-ups`;
    }
    if (type === PLANK) {
      return `${reps}s push-up plank`;
    }
  }, []);

  const checkboxStateValues = Object.values(checkboxState);
  const isSubmitDisabled =
    checkboxStateValues.length === 0 ||
    checkboxStateValues.some((isChecked) => !isChecked);

  return (
    <div>
      <Head>
        <title>flexin | Day {day}</title>
      </Head>
      <main className="flex items-center justify-center h-screen flex-col px-4 sm:px-0">
        <form
          className="bg-white shadow-md rounded p-6 flex flex-col w-full max-w-xs space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {workout?.sets.map((reps, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`set-${index}`}
                  name={`set-${index}`}
                  checked={checkboxState[`set-${index}`]}
                  onChange={handleCheckboxChange}
                />
                <label className="px-4" htmlFor={`set-${index}`}>
                  {renderRepsLabel(workout?.type, reps)}
                </label>
              </div>
            ))}
          </div>
          <button
            className={`text-white font-bold py-2 px-4 rounded ${
              isSubmitDisabled
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 cursor-pointer'
            }`}
            type="submit"
            disabled={isSubmitDisabled}
          >
            Save
          </button>
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

  // redirect to 404 page if user tries to access workout beyond 30 days
  const { day } = context.query;
  const dayInt = parseInt(day as string, 10);
  if (dayInt > 30) {
    return {
      redirect: {
        destination: '/404',
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

  return {
    props: {
      profile: JSON.parse(JSON.stringify(user.profile)),
      workout: ROUTINE_SCHEDULE[dayInt - 1],
    },
  };
}

export default WorkoutDay;
