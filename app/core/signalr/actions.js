import {
  CONNECTED,
  DISCONNECTED,
  RECONNECTED,
  START_SOCKET_CONNECTION,
  BEGIN_SUBCRIBE,
  END_SUBSCRIBE,
  DISCONNECT
} from './constants';

export function disconnect() {
  return {
    type: DISCONNECT
  };
}

export function disconnected() {
  return {
    type: DISCONNECTED
  };
}

export function connected() {
  return {
    type: CONNECTED
  };
}

export function reconnected() {
  return {
    type: RECONNECTED
  };
}

export function startConnection(options) {
  return {
    type: START_SOCKET_CONNECTION,
    options
  };
}

export function subscribe(event, callback) {
  return {
    type: BEGIN_SUBCRIBE,
    event,
    callback
  };
}

export function subscribeGroup(event, group, callback) {
  return {
    type: BEGIN_SUBCRIBE,
    event,
    group,
    callback
  };
}

export function unsubscribe(event) {
  return {
    type: END_SUBSCRIBE,
    event
  };
}

export function unsubscribeGroup(event, group) {
  return {
    type: END_SUBSCRIBE,
    event,
    group
  };
}
