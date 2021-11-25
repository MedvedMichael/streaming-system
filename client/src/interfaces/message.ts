export interface ServerMessage {
  messageID: string;
  text: string;
  time: Date;
  senderID: string;
}

export default interface Message extends ServerMessage {
  isSent: boolean;
}
