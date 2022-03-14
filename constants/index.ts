import { Exercise, Workout } from 'index';

export const PUSHUP: Exercise = 'pushup';
export const PLANK: Exercise = 'plank';

export const ROUTINE_SCHEDULE: Readonly<Workout[]> = Object.freeze([
  {
    type: PUSHUP,
    sets: [4, 2, 2],
  },
  {
    type: PUSHUP,
    sets: [6, 2, 2],
  },
  {
    type: PLANK,
    sets: [10, 10, 10],
  },
  {
    type: PUSHUP,
    sets: [8, 4, 2],
  },
  {
    type: PUSHUP,
    sets: [10, 4, 4],
  },
  {
    type: PUSHUP,
    sets: [10, 6, 4],
  },
  {
    type: PLANK,
    sets: [15, 15, 15],
  },
  {
    type: PUSHUP,
    sets: [12, 4, 4],
  },
  {
    type: PUSHUP,
    sets: [14, 6, 4],
  },
  {
    type: PUSHUP,
    sets: [16, 6, 4],
  },
  {
    type: PLANK,
    sets: [20, 20, 20],
  },
  {
    type: PUSHUP,
    sets: [16, 8, 5],
  },
  {
    type: PUSHUP,
    sets: [16, 10, 5],
  },
  {
    type: PUSHUP,
    sets: [18, 12, 5],
  },
  {
    type: PLANK,
    sets: [20, 20, 20, 20],
  },
  {
    type: PUSHUP,
    sets: [20, 10, 5],
  },
  {
    type: PUSHUP,
    sets: [22, 10, 5],
  },
  {
    type: PUSHUP,
    sets: [24, 12, 8],
  },
  {
    type: PLANK,
    sets: [20, 20, 20, 20, 20],
  },
  {
    type: PUSHUP,
    sets: [26, 14, 8],
  },
  {
    type: PUSHUP,
    sets: [26, 15, 5],
  },
  {
    type: PUSHUP,
    sets: [26, 15, 10],
  },
  {
    type: PLANK,
    sets: [25, 25, 25, 25, 25],
  },
  {
    type: PUSHUP,
    sets: [28, 15, 10],
  },
  {
    type: PUSHUP,
    sets: [30, 15, 15],
  },
  {
    type: PUSHUP,
    sets: [35, 15, 5],
  },
  {
    type: PLANK,
    sets: [25, 25, 25, 25, 25, 25],
  },
  {
    type: PUSHUP,
    sets: [40, 15, 5],
  },
  {
    type: PLANK,
    sets: [30, 30, 30, 30, 30, 30],
  },
  {
    type: PUSHUP,
    sets: [50],
  },
]);
