import { Record } from 'immutable';
import * as constants from './constants';

const initialState = Record({
  announcementQueue: []
});

export default function announcementReducer(state = new initialState(), { type, payload }) {
  let queue;
  switch (type) {
    case constants.ADD_ANNOUNCEMENT:
      // For now, we only display one announcement at a time
      queue = [];
      queue.push({ message: payload.message, id: payload.id, type: payload.type, delay: 0 });
      return state.set('announcementQueue', queue);
    case constants.REMOVE_ANNOUNCEMENT:
      queue = state.announcementQueue.filter(announcement => {
        return announcement.id !== payload.id;
      });
      return state.set('announcementQueue', queue);
    default:
      return state;
  }
}
