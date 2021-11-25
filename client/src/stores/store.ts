import { makeAutoObservable } from "mobx";
import WebSocketClient from "socket";
import Chat from "interfaces/chat";
import { NewMessage } from "interfaces/new-message";
import { v4 as uuid } from "uuid";
import {
  AddNewChatFunction,
  AddNewChatParams,
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  GetOldMessagesFunction,
  GetOldMessagesParams,
  GetOldMessagesResponse,
  NewChatNotification,
  NewMessageNotification,
  NewMessageNotificationParams,
} from "interfaces/rpc-events";
import { ServerMessage } from "interfaces/message";
import { refresh } from "services/auth.service";
import { getMyProfile } from "services/users.service";
import User, { IProfile } from "interfaces/User.interface";

export class ChatStore {
  accessToken!: string;
  chats: Chat[] = [];
  online = false;
  myID!: string;
  user!: IProfile;
  initialized = false;
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

  initSocket(): void {
    this.socket = new WebSocketClient();
    this.socket.listenTo("open", () => {
      this.online = true;
      this.socket
        .listenOnce<ConnectionStatusNotificationPayload>(
          ConnectionStatusNotification
        )
        .then(async (res) => {
          if (!res.ok) {
            await this.checkValidToken();
          }

          await this.sendMessages();
          await this.getMessages();
        });
    });

    this.socket.listenTo("close", (res) => {
      this.online = false;
    });

    this.socket.listenTo("error", (err) => {
      console.log(err);
    });

    this.socket.listenTo(
      NewMessageNotification,
      (message: NewMessageNotificationParams) => {
        const messageList = this.chats.find(
          (chat) => chat.chatID === message.chatID
        )?.messageList;
        if (!messageList?.find((m) => m.messageID === message.messageID)) {
          messageList?.push({
            ...message,
            time: new Date(message.time),
            isSent: true,
          });
        }
        this.chats = [...this.chats];
      }
    );

    this.socket.listenTo(NewChatNotification, (chat: Chat) => {
      this.chats = [chat, ...this.chats];
    });
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

  async getMessages(): Promise<void> {
    try {
      await this.checkValidToken();
      const res = await this.socket.call<GetMessagesFunctionResponse>(
        GetMessagesFunction
      );
      this.chats = res.map((chat) => ({
        ...chat,
        messageList: chat.messageList
          .map((message) => ({
            ...message,
            time: new Date(message.time),
          }))
          .sort((a, b) => a.time.getTime() - b.time.getTime()),
      }));
    } catch (error) {}
  }

  addMessage(chatID: string, text: string): void {
    const id = uuid();
    const message: ServerMessage = {
      messageID: id,
      senderID: this.myID,
      time: new Date(),
      text,
    };
    const messagesQueue = this.getLocalStorageQueue();
    this.setLocalStorageQueue([...messagesQueue, { ...message, chatID }]);
    this.chats
      .find((chat) => chat.chatID === chatID)
      ?.messageList.push({ ...message, isSent: false });
    this.sendOneMessage({ ...message, chatID });
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

  async sendOneMessage(msg: NewMessage): Promise<void> {
    await this.checkValidToken();

    if (this.online) {
      const res: { ok: boolean } = await this.socket.call(
        AddNewMessageFunction,
        msg
      );
      if (res.ok) {
        const currentChatIndex = this.chats.findIndex(
          (chat) => chat.chatID === msg.chatID
        );
        const currentMessageIndex = this.chats[
          currentChatIndex
        ]?.messageList.findIndex(
          (message) => message.messageID === msg.messageID
        );
        if (currentChatIndex !== -1 && currentMessageIndex !== -1) {
          const message =
            this.chats[currentChatIndex].messageList[currentMessageIndex];
          message.isSent = true;
          this.chats[currentChatIndex].messageList[currentMessageIndex] = {
            ...message,
          };
          this.chats[currentChatIndex] = { ...this.chats[currentChatIndex] };
          const messagesQueue = this.getLocalStorageQueue();
          messagesQueue.splice(
            messagesQueue.findIndex((m) => m.messageID === msg.messageID),
            1
          );
          this.setLocalStorageQueue(messagesQueue);
        }
      }
    }
  }

  async sendMessages(): Promise<void> {
    const messagesQueue = this.getLocalStorageQueue();
    for (const message of messagesQueue) {
      console.log(message);
      await this.sendOneMessage(message);
    }
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

  async addNewChat(memberID: string): Promise<string> {
    const chat: Chat = await this.socket.call(AddNewChatFunction, {
      memberID,
    } as AddNewChatParams);
    this.chats = [chat, ...this.chats];
    return chat.chatID;
  }

  async getMessagesOfChat(
    chatID: string,
    lastMessageID: string
  ): Promise<void> {
    try {
      const res = (
        await this.socket.call<GetOldMessagesResponse>(GetOldMessagesFunction, {
          chatID,
          lastMessageID,
        } as GetOldMessagesParams)
      ).map((m) => ({ ...m, time: new Date(m.time) }));
      this.chats
        .find((chat) => chat.chatID === chatID)
        ?.messageList.unshift(...res);
    } catch (error) {}
  }
}

let chatStore = new ChatStore();

export function reloadChatStore(): void {
  chatStore = new ChatStore();
}

export default chatStore;
