import { Client } from 'rpc-websockets';
import { IWSRequestParams } from 'rpc-websockets/dist/lib/client';
import 'dotenv/config';

class WebSocketClient {
  //Server
  private socket = new Client(process.env.REACT_APP_ADDR_NAME, {
    max_reconnects: 0,
  });
  //Save call functions
  private listeners: string[] = [];

  //Get listener list
  getListeners(): string[] {
    return this.listeners;
  }

  listenOnce<T>(event: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.socket.once(event, (res: T) => {
        resolve(res);
      });
    });
  }

  //Call function on the server
  call<T>(method: string, data?: IWSRequestParams): Promise<T> {
    return this.socket.call(method, data) as Promise<T>;
  }

  //create listener to word
  listenTo<T>(event: string, callback: (response: T) => void): void {
    this.socket.on(event, (response: T) => {
      callback(response);
    });
    this.listeners.push(event);
  }
}

export default WebSocketClient;
