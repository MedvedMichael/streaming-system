import { makeAutoObservable } from "mobx";
import WebSocketClient from "socket";
import Chat from "interfaces/chat";
import { NewMessage } from "interfaces/new-message";
import { v4 as uuid } from "uuid";
import {
  AddNewChatFunction,
  AddNewChatParams,
  AddNewMessageFunction,
  AddNewMessageParams,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  GetStreamChatFunction,
  GetStreamChatResponse,
  // GetOldMessagesResponse,
  NewChatNotification,
  NewMessageNotification,
  NewMessageNotificationParams,
  SetStreamFunction,
} from "interfaces/rpc-events";
import { ServerMessage } from "interfaces/message";
import { refresh } from "services/auth.service";
import { getMyProfile } from "services/users.service";
import { IProfile } from "interfaces/User.interface";
import {
  IMessageWithNickname,
  ServerStream,
} from "interfaces/Stream.interface";
import { changeMyStreamName, getStreamsData } from "services/streams.service";

export class ChatStore {
  accessToken!: string;
  currentChat: IMessageWithNickname[] = [];
  online = false;
  myID!: string;
  streamKey!: string;
  user!: IProfile;
  initialized = false;
  streamsData: ServerStream[] = [];
  private exp = 0;
  private socket!: WebSocketClient;

  constructor() {
    makeAutoObservable(this);
    refresh()
      .then(({ accessToken }): void => {
        this.setAccessToken(accessToken);
      })
      .catch(() => {
        this.online = false;
        this.initialized = true;
      });
  }

  setUser(newUserInfo: IProfile): void {
    this.user = newUserInfo;
  }

  async initSocket(): Promise<void> {
    if (!this.socket) {
      return new Promise((resolve, reject) => {
        this.socket = new WebSocketClient();
        this.socket.listenTo("open", () => {
          this.online = true;
          this.socket
            .listenOnce<ConnectionStatusNotificationPayload>(
              ConnectionStatusNotification
            )
            .then(async (res) => {
              if (!res.ok) {
                await refresh();
                return reject();
              }
              resolve();
            });
        });

        this.socket.listenTo("error", (err) => {
          console.log(err);
        });

        this.socket.listenTo(
          NewMessageNotification,
          (message: NewMessageNotificationParams) => {
            this.currentChat = [
              { ...message, createdAt: new Date(message.createdAt) },
              ...this.currentChat,
            ];
          }
        );
      });
    }
  }

  async setAccessToken(accessToken: string): Promise<void> {
    this.accessToken = accessToken;

    await this.setMyProfile();
    // this.initSocket();
  }

  private async checkValidToken(): Promise<void> {
    if (Date.now() >= this.exp * 1000) {
      const { accessToken } = await refresh();
      this.accessToken = accessToken;
    }
  }

  async setStream(streamKey: string) {
    await this.socket.call(SetStreamFunction, { streamKey });
    this.streamKey = streamKey;
  }

  async getMessages(): Promise<void> {
    try {
      const messages = await this.socket.call<GetStreamChatResponse>(
        GetStreamChatFunction
      );
      this.currentChat = messages.map((m) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
    } catch (error) {}
  }

  async addMessage(text: string): Promise<void> {
    const res: DeliveredEvent = await this.socket.call(AddNewMessageFunction, {
      text,
    });
    if (res.ok) {
      this.currentChat.splice(0, 0, {
        text,
        postedBy: this.user._id,
        nickname: this.user.nickname,
        createdAt: new Date(),
      });
    }
  }

  getLocalStorageQueue(): NewMessage[] {
    const localStorageQueue =
      localStorage.getItem("queue") == null
        ? "[]"
        : (localStorage.getItem("queue") as string);

    try {
      return JSON.parse(localStorageQueue);
    } catch (error) {
      return [];
    }
  }

  setLocalStorageQueue(messagesQueue: NewMessage[]): void {
    localStorage.setItem("queue", JSON.stringify(messagesQueue));
  }

  async setMyProfile(): Promise<void> {
    try {
      const user = await getMyProfile(this.accessToken);
      this.user = user;
    } catch (err) {
    } finally {
      this.initialized = true;
    }
  }

  async fetchStreamsData() {
    try {
      this.streamsData = await getStreamsData(this.accessToken);
    } catch {
      window.history.pushState(null, "", "/");
      document.location.reload();
    }
  }

  async changeStreamName(newName: string) {
    await changeMyStreamName(this.accessToken, this.user.streamKey, newName);
    const stream = this.streamsData.find(
      (s) => s.streamKey === this.user.streamKey
    );
    if (stream) stream.name = newName;
  }
}

let chatStore = new ChatStore();

export function reloadChatStore(): void {
  chatStore = new ChatStore();
}

export default chatStore;
