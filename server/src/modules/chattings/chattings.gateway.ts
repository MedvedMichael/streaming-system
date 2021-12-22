import WebSocket, { Server } from 'ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import broadcast from 'src/helpers/broadcast';
import { ChattingSession, ChattingsService } from './chattings.service';
import { NewMessage } from '@interfaces/new-message';
import {
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  DeliveredEvent,
  GetStreamChatFunction,
  NewMessageNotification,
  NewMessageNotificationParams,
  GetStreamChatResponse,
  SetStreamFunction,
  SetStreamParams,
  AddNewMessageParams,
} from '@interfaces/rpc-events';
import { IncomingMessage } from 'http';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { generateJsonRpcNotification } from 'src/helpers/json-rpc.utils';
import { ErrorType, JsonRpcErrorCodes } from '@interfaces/json-rpc';
import { UnauthorizedException } from '@nestjs/common';
import Chat, { lengthOldMessagesPackage } from '@interfaces/chat';
import { StreamsService } from '../streams/streams.service';
import { IMessage } from '@interfaces/Stream.interface';
import { UsersService } from '../users/users.service';

const invalidTokenError = {
  error: { code: JsonRpcErrorCodes.INVALID_REQUEST, message: 'INVALID TOKEN!' },
};

@WebSocketGateway({ path: '/chattings' })
export class ChattingsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private chatingsService: ChattingsService,
    private jwtService: JwtService,
    private streamsService: StreamsService,
    private usersService: UsersService,
  ) {}

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const accessToken = cookie.parse(
      request.headers.cookie ? request.headers.cookie : '',
    ).accessToken;

    const sendResponse = (
      payload: ConnectionStatusNotificationPayload,
    ): void => {
      client.send(
        JSON.stringify(
          generateJsonRpcNotification(ConnectionStatusNotification, payload),
        ),
      );
    };
    try {
      if (!accessToken) {
        throw new Error();
      }
      const res = this.jwtService.verify(accessToken);

      const session: ChattingSession = {
        token: accessToken,
        userID: res.userID,
        socket: client,
      };

      this.chatingsService.addNewSession(session);
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({ ok: false, code: -32600, message: 'INVALID TOKEN' });
      return client.close(1014);
    }
  }

  handleDisconnect(client: WebSocket): void {
    this.chatingsService.removeSession(client);
  }

  @SubscribeMessage(SetStreamFunction)
  async setStream(
    @MessageBody() { streamKey }: SetStreamParams,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session) {
        throw new UnauthorizedException();
      }
      this.jwtService.verify(session.token);
      session.streamKey = streamKey;
      return { ok: true };
    } catch (error) {
      console.log(error);
      return invalidTokenError;
    }
  }

  @SubscribeMessage(GetStreamChatFunction)
  async getChat(
    @ConnectedSocket() socket: WebSocket,
  ): Promise<GetStreamChatResponse | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session || !session.streamKey) {
        throw new UnauthorizedException();
      }
      this.jwtService.verify(session.token);
      return this.streamsService.getStreamChat(session.streamKey);
    } catch (error) {
      console.log(error);
      return invalidTokenError;
    }
  }

  @SubscribeMessage(AddNewMessageFunction)
  async addNewMessage(
    @MessageBody() { text }: AddNewMessageParams,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session || !session.streamKey) {
        throw new UnauthorizedException();
      }

      this.jwtService.verify(session.token);
      await this.streamsService.addNewMessage(
        { text, postedBy: session.userID },
        session.streamKey,
      );

      const user = await this.usersService.getUser(session.userID);

      const recievers = this.chatingsService
        .getSessions()
        .reduce(
          (acc, { streamKey, token, socket }) =>
            streamKey === session.streamKey && token !== session.token
              ? [...acc, socket]
              : acc,
          [] as WebSocket[],
        );

      broadcast<NewMessageNotificationParams>(
        NewMessageNotification,
        recievers,
        {
          text,
          postedBy: session.userID,
          nickname: user.nickname,
          createdAt: new Date(),
        },
      );
      return { ok: true };
    } catch (error) {
      return invalidTokenError;
    }
  }
}
