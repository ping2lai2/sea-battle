export const DECREMENT_TIMER = 'DECREMENT_TIMER';
export const RESET_TIMER = 'RESET_TIMER';

export const decrementTimer = () => ({
  type: DECREMENT_TIMER,
});

export const resetTimer = () => ({
  type: RESET_TIMER,
});