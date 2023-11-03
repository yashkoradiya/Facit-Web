import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { getConfig } from '../settings/settings';
//let socketUrl;

// function configureSignalr(url) {
//   socketUrl = url;
// }
const hostname = window && window.location && window.location.hostname;
const url = getConfig(hostname).SOCKETS_HUB;
function createHubConnection() {
  return new HubConnectionBuilder()
    .withUrl(url, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .configureLogging(LogLevel.Information)
    .build();
  //connection.start().catch(err => console.error(err.toString()));
}

export { createHubConnection };

//export default configureSignalr;
