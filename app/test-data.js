import { Record, List, Map } from 'immutable';
import { userStateTD } from 'appState/appState-testdata';

export const newUserState = {
  appState: new (Record({
    user: new (Record({ name: 'User A', roles: List(['new_user']), access: {} }))()
  }))()
};

export const userState = {
  appState: new (Record({
    user: userStateTD,
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};
