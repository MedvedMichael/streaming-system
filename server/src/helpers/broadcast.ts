import WebSocket from 'ws';
import { generateJsonRpcNotification } from './json-rpc.utils';

export default function broadcast<T>(
  event: string,
  clients: WebSocket[],
  params?: T,
): void {
  clients.forEach((client) => {
    const message = generateJsonRpcNotification(event, params);
    client.send(JSON.stringify(message));
  });
}
