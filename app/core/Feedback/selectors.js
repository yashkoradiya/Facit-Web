import { createSelector } from 'reselect';

const selectedFeedback = state => state.feedback;

export default createSelector(selectedFeedback, state => {
  const queue = [...state.errors.queue, ...state.feedback.queue];
  return {
    feedback: queue[queue.length - 1]
  };
});
