import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Profile } from '@prisma/client';
import { useMutation } from 'react-query';

import { ROUTINE_SCHEDULE, PLANK, PUSHUP } from '../../constants';
import { NextPage, NextPageContext } from 'next';
import { Exercise, Workout } from 'index';
import { prisma } from 'lib/prisma';

interface Props {
  profile: Profile;
  workout: Workout;
}

const WorkoutDay: NextPage<Props> = ({ profile, workout }) => {
  const [checkboxState, setcheckboxState] = useState(
    {} as Record<string, boolean>
  );
  const router = useRouter();
  const { day } = router.query;

  const mutation = useMutation<Profile, unknown, { currentDay: number }>(
    async (updatedProfile) => {
      const response = await fetch(`/api/profile/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
      const newProfile = await response.json();
      return newProfile;
    },
    {
      onSuccess: () => {
        // navigate back to the home page
        router.push('/');
      },
    }
  );

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
      mutation.mutate({ currentDay: parseInt(day as string, 10) });
    },
    [day, mutation]
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
    mutation.isLoading ||
    checkboxStateValues.length < workout.sets.length ||
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
          <h1 className="text-xl">Day {day}</h1>
          <div className="space-y-4">
            {workout?.sets.map((reps, index) => (
              <div className="flex items-center" key={index}>
                <input
                  className="form-checkbox h-5 w-5"
                  type="checkbox"
                  id={`set-${index}`}
                  name={`set-${index}`}
                  checked={checkboxState[`set-${index}`]}
                  onChange={handleCheckboxChange}
                />
                <label className="px-4 text-lg" htmlFor={`set-${index}`}>
                  {renderRepsLabel(workout?.type, reps)}
                </label>
              </div>
            ))}
          </div>
          <button
            className={`text-white font-bold py-2 px-4 rounded flex justify-center ${
              isSubmitDisabled
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 cursor-pointer'
            }`}
            type="submit"
            disabled={isSubmitDisabled}
          >
            {mutation.isLoading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Save'
            )}
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
