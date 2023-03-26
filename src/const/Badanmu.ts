export enum BadanmuState {
  connected = 'connected',
  disconnected = 'disconnected',
  error = 'error',
}

export enum BadanmuType {
  heartbeat = 'heartbeat',
  connect = 'connect',
  disconnectUnexpect = 'disconnectUnexpect',
  disconnectManually = 'disconnectManually',
  error = 'error',
  comment = 'comment',
  gift = 'gift',
  enter = 'enter',
  follow = 'follow',
}
