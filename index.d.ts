export type Exercise = 'pushup' | 'plank';

export interface Workout {
  type: Exercise;
  sets: number[];
}
