import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ROUTINE_SCHEDULE, PLANK, PUSHUP } from '../../constants';
import { NextPage, NextPageContext } from 'next';
import { Exercise, Workout } from 'index';

interface Props {
  workout?: Workout;
}

const WorkoutDay: NextPage<Props> = ({ workout }) => {
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
      // TODO: mark workout as complete

      // navigate back to the home page
      router.push('/');
    },
    [router]
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

WorkoutDay.getInitialProps = async (ctx: NextPageContext) => {
  const { day } = ctx.query;
  const dayInt = parseInt(day as string, 10);

  if (dayInt > 30 && ctx.res) {
    ctx.res.writeHead(302, { Location: '/404' });
    ctx.res.end();
    return {};
  }
  const workout = ROUTINE_SCHEDULE[dayInt - 1];
  return { workout };
};

export default WorkoutDay;
