/* istanbul ignore file */

export const processServiceWorkerMessage = (event, externalWindowRef, clearFn, url) => {
  if (process.env.NODE_ENV === 'test') return;
  let win = externalWindowRef.current;
  const message = {
    event: event.node.selected ? 'add' : 'remove',
    data: event.data
  };

  if (win || message.event === 'remove') {
    postMessage(message);
  } else {
    event.node.setSelected(true);
    win = window.open(url, '_blank');
    win.onload = () => {
      win.onServiceWorkerReady = () => {
        postMessage(message);
      };
    };

    win.onunload = unloadEvent => {
      if (unloadEvent.target.URL !== 'about:blank') {
        externalWindowRef.current = null;
        if (clearFn) {
          clearFn();
        }
      }
    };

    externalWindowRef.current = win;
  }
};

const postMessage = ({ event, data }) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      event: event,
      data: data ? data : null
    });
  }
};
