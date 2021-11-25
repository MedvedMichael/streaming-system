import { JsonRpcError, JsonRpcNotification, JsonRpcResponse } from '@interfaces/json-rpc';

export const generateJsonRpcResponse = (
  value: Record<string, unknown>,
  id: number,
): JsonRpcResponse => ({
  jsonrpc: '2.0',
  result: value,
  id,
});

export const generateJsonRpcError = (
  error: {
    code: number;
    message: string;
  },
  id: number,
): JsonRpcError => ({
  jsonrpc: '2.0',
  error,
  id,
});

export const generateJsonRpcNotification = <Payload>(
  notification: string,
  params?: Payload,
): JsonRpcNotification => ({
  jsonrpc: '2.0',
  notification,
  params,
});

export const generateJsonRpcFromValue = (
  value: Record<string, unknown>,
  id: number,
): JsonRpcError | JsonRpcResponse =>
  value.error
    ? generateJsonRpcError(value.error as { code: number; message: string }, id)
    : generateJsonRpcResponse(value, id);
