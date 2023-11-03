import { take, takeLatest, takeEvery, put, call, fork, all, cancel, cancelled } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { List } from 'immutable';
import { createHubConnection } from './index';
import { startConnection, connected, disconnected } from './actions';
import { addError } from '../Feedback/actions';
import {
  START_SOCKET_CONNECTION,
  DISCONNECT,
  DISCONNECTED,
  BEGIN_SUBCRIBE,
  END_SUBSCRIBE,
  CONNECTED
} from './constants';
import { SOCKETS_CONNECTION_FAILED } from '../Feedback/errorConfig';

const SOCKET_CONNECTED = 1;

function connect() {
  return new Promise(resolve => {
    tryConnect(resolve);
  });
}

function tryConnect(resolve) {
  if (process.env.NODE_ENV === 'test') return;

  const connection = createHubConnection();
  connection
    .start()
    .then(() => {
      console.debug('socket connected');
      resolve(connection);
    })
    .catch(() => {
      console.log('error connecting, will try again in 2,5 sec');
      setTimeout(() => {
        tryConnect(resolve, connection);
      }, 2500);
    });
}

const createConnectionChannel = socket => {
  return eventChannel(emit => {
    socket.onclose(() => {
      console.warn('socket connection closed');
      emit(disconnected());
      emit(END);
    });

    return () => {};
  });
};

const createSubscriptionChannel = (socket, action) => {
  return eventChannel(emit => {
    const { event, callback, group } = action;
    console.log(`signalr: subscribing to ${event}`);

    const actionToRun = data => {
      emit(callback(data));
    };

    if (group) {
      socket.invoke('JoinGroup', group);
    }

    socket.on(event, actionToRun);

    const unsubscribeCallback = () => {
      console.log(`signalr: unsubscribing from ${event}`);

      if (group && socket.connection.connectionState === SOCKET_CONNECTED) {
        socket.invoke('LeaveGroup', group);
      }

      socket.off(event, actionToRun);
    };
    return unsubscribeCallback;
  });
};

function* read(channel) {
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

let channels = List([]);
let subscriptions = List([]);

function* handleSubscribe(socket, action) {
  const existingSubscription = subscriptions.find(x => x.event === action.event && x.group === action.group);
  if (existingSubscription) {
    console.warn(`Already subscribing to ${action.event}! Ignoring...`);
    return;
  }

  subscriptions = subscriptions.push(action);
  const { event, group } = action;
  const subscriptionChannel = yield call(createSubscriptionChannel, socket, action);
  channels = channels.push({ key: `${group}${event}`, channel: subscriptionChannel });

  yield fork(read, subscriptionChannel);
}

function handleUnsubscribe(action) {
  const { event, group } = action;
  subscriptions = subscriptions.filter(s => s.event !== event && s.group !== group);

  const channelsToUnsubscribe = channels.filter(c => c.key === `${group}${event}`);
  channels = channels.filter(c => c.key !== `${group}${event}`);
  channelsToUnsubscribe.forEach(c => {
    c.channel.close();
  });
}

function* handleReconnect() {
  while (true) {
    yield take(DISCONNECTED);
    yield put(startConnection({ reconnect: true }));
  }
}

export function* handleDispatchError() {
  while (true) {
    yield take(DISCONNECTED);
    yield put(addError(SOCKETS_CONNECTION_FAILED));
  }
}

let pendingSubscriptions = List([]);
function handlePendingSubscriptions(action) {
  pendingSubscriptions = pendingSubscriptions.push(action);
}

function* watchPendingSubscriptions() {
  yield takeLatest(BEGIN_SUBCRIBE, handlePendingSubscriptions);

  yield take(CONNECTED);

  const subscriptionsToAdd = pendingSubscriptions.toJS();
  for (let index in subscriptionsToAdd) {
    // eslint-disable-line
    yield put(subscriptionsToAdd[index]);
  }

  pendingSubscriptions = pendingSubscriptions.clear();

  yield cancel();
}

export function* saga(action) {
  //flow
  const { options } = action;

  yield fork(watchPendingSubscriptions);

  const socket = yield call(connect);
  const connectionChannel = yield call(createConnectionChannel, socket);

  while (true) {
    yield takeEvery(BEGIN_SUBCRIBE, handleSubscribe, socket);
    yield takeEvery(END_SUBSCRIBE, handleUnsubscribe);

    const task = yield fork(read, connectionChannel);
    yield put(connected());
    if (options && options.reconnect) {
      const toReconnect = List(subscriptions).toJS();
      subscriptions = subscriptions.clear();

      // we have to use a regular for loop as we can't yield properly from a map/foreach
      for (let act in toReconnect) {
        // eslint-disable-line
        console.debug('Reconnecting to', toReconnect[act]);
        yield put(toReconnect[act]);
      }
    }

    yield fork(handleReconnect);
    yield fork(handleDispatchError);
    yield take(DISCONNECT);

    yield cancel(task);
  }
}

export function* watch() {
  yield takeLatest(START_SOCKET_CONNECTION, saga);
  yield put(startConnection({ reconnect: false }));
}

export default function* root() {
  yield all([fork(watch)]);
}
