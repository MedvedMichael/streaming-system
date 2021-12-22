import Chat from './chat';
import { IMessageWithNickname } from './Stream.interface';


export const AddNewMessageFunction = 'addNewMessage';
export type AddNewMessageParams = {
  text: string
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = IMessageWithNickname;

export interface DeliveredEvent {
  ok: boolean;
}

export const ConnectionStatusNotification = 'connection-status';
export interface ConnectionStatusNotificationPayload {
  ok: boolean;
  code?: number;
  message?: string;
}

export const GetStreamChatFunction = 'getStreamChat';
export type GetStreamChatResponse = IMessageWithNickname[];


export const SetStreamFunction = 'setStream'
export interface SetStreamParams {
  streamKey: string
}