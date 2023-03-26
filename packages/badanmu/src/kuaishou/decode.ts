import protobuf from 'protobufjs'
import protoJson from './kuaishou.proto.json'

import { decodeLib } from './lib'

const pb = protobuf.Root.fromJSON(protoJson)
const socketMessagePb = pb.lookupType('SocketMessage')

const commandList = {
  SC_HEARTBEAT_ACK: pb.lookupType('SCWebHeartbeatAck'),
  SC_ERROR: pb.lookupType('SCWebError'),
  SC_INFO: pb.lookupType('SCInfo'),
  SC_ENTER_ROOM_ACK: pb.lookupType('SCWebEnterRoomAck'),
  SC_FEED_PUSH: pb.lookupType('SCWebFeedPush'),
  SC_RED_PACK_FEED: pb.lookupType('SCWebCurrentRedPackFeed'),
  SC_LIVE_WATCHING_LIST: pb.lookupType('SCWebLiveWatchingUsers'),
  SC_GUESS_OPENED: pb.lookupType('SCWebGuessOpened'),
  SC_GUESS_CLOSED: pb.lookupType('SCWebGuessClosed'),
  SC_RIDE_CHANGED: pb.lookupType('SCWebRideChanged'),
  SC_BET_CHANGED: pb.lookupType('SCWebBetChanged'),
  SC_BET_CLOSED: pb.lookupType('SCWebBetClosed'),
  SC_LIVE_SPECIAL_ACCOUNT_CONFIG_STATE: pb.lookupType('SCWebLiveSpecialAccountConfigState'),
}

type CommandKeys = keyof typeof commandList

type Pack = {
  type: string
  payload: Record<string, any>
}
export function decode(type: CommandKeys, data: Uint8Array): Pack {
  const cmd = commandList[type]
  const payload = cmd.toObject(cmd.decode(data))

  return { type, payload }
}

const h = decodeLib.codec.utf8String.toBits('PPbzKKL7NB15leYy')
const v = decodeLib.codec.utf8String.toBits('JRODKJiolJ9xqso0')
const y = decodeLib.cipher.aes
const m = new y(h)

function decodePayload(t: Uint8Array) {
  return new Uint8Array(
    decodeLib.codec.arrayBuffer.fromBits(
      decodeLib.mode.cbc.decrypt(
        m,
        decodeLib.codec.arrayBuffer.toBits(t.buffer.slice(t.byteOffset, t.byteLength + t.byteOffset)),
        v,
        []
      ),
      !1
    )
  )
}

const SC_COMMAND_MAP = {
  101: 'SC_HEARTBEAT_ACK',
  103: 'SC_ERROR',
  105: 'SC_INFO',
  300: 'SC_ENTER_ROOM_ACK',
  310: 'SC_FEED_PUSH',
  330: 'SC_RED_PACK_FEED',
  340: 'SC_LIVE_WATCHING_LIST',
  370: 'SC_GUESS_OPENED',
  371: 'SC_GUESS_CLOSED',
  412: 'SC_RIDE_CHANGED',
  441: 'SC_BET_CHANGED',
  442: 'SC_BET_CLOSED',
  645: 'SC_LIVE_SPECIAL_ACCOUNT_CONFIG_STATE',
} as const

type MessagePack = {
  payload?: Uint8Array
  payloadType: number
  compressionType: number
}

export function decodeMsg(data: ArrayBufferLike): Pack | undefined {
  const pack = socketMessagePb.decode(new Uint8Array(data)) as unknown as MessagePack
  if (pack.payload) {
    const data = 3 === pack.compressionType ? decodePayload(pack.payload) : pack.payload
    const code = pack.payloadType as keyof typeof SC_COMMAND_MAP
    const type = SC_COMMAND_MAP[code]
    if (type) return decode(type, data)
  }
}
