import Chat from './chat';
import Message from './message';
import { NewMessage } from './new-message';

export const GetMessagesFunction = 'getMessages';
export type GetMessagesFunctionResponse = Chat[];

export const AddNewMessageFunction = 'addNewMessage';
export interface AddNewMessageParams {
  message: Message;
}

export const AddNewChatFunction = 'addNewChat';
export interface AddNewChatParams {
  memberID: string;
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = NewMessage;

export interface DeliveredEvent {
  ok: boolean;
}

export const ConnectionStatusNotification = 'connection-status';
export interface ConnectionStatusNotificationPayload {
  ok: boolean;
  code?: number;
  message?: string;
}

export const NewChatNotification = 'newChat';
export type NewChatNotificationParams = Chat;

export const GetOldMessagesFunction = 'getOldMessages';
export interface GetOldMessagesParams {
  chatID: string;
  lastMessageID: string;
}
export type GetOldMessagesResponse = Message[];
