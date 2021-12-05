import { Injectable } from '@nestjs/common';
import WebSocket from 'ws';

export interface ChattingSession {
  socket: WebSocket;
  userID: string;
  streamKey?: string;
  token: string;
}

@Injectable()
export class ChattingsService {
  private sessions: ChattingSession[] = [];

  getSessions(): ChattingSession[] {
    return this.sessions;
  }

  addNewSession(session: ChattingSession): void {
    this.sessions.push(session);
  }

  removeSession(socket: WebSocket): void {
    const index = this.sessions.findIndex((s) => s.socket === socket);
    this.sessions.splice(index, 1);
  }

  getSession(socket: WebSocket): ChattingSession | undefined {
    return this.sessions.find((s) => s.socket === socket);
  }
}
