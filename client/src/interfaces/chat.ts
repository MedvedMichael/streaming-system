import Message from './message';

export interface SenderInfo {
  firstName: string;
  lastName: string;
  senderID: string;
}

export default interface Chat {
  messageList: Message[];
  chatID: string;
  numberOfMessages: number;
  senderInfo: SenderInfo;
}

export const lengthOldMessagesPackage = 20;
