import * as constants from './constants';
import { v4 as uuidv4 } from 'uuid';

export function addAnnouncement(payload) {
  return {
    type: constants.ADD_ANNOUNCEMENT,
    payload: {
      message: payload.message,
      type: payload.type,
      id: uuidv4()
    }
  };
}
