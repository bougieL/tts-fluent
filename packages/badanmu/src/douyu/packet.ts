import { deserialize } from './serialize'

export type DataType = string | number
export interface MessageType {
  [key: string]: DataType | DataType[] | MessageType
}
export type MessageValue = MessageType[string]

export const encode = (data: string): ArrayBufferLike => {
  const len = Buffer.byteLength(data) + 9
  const buf = Buffer.concat([
    Buffer.from([len, 0x00, 0x00, 0x00, len, 0x00, 0x00, 0x00, 0xb1, 0x02, 0x00, 0x00]),
    Buffer.from(data),
    Buffer.from([0x00]),
  ])
  return buf
}

export interface Packet<T = MessageValue> {
  packetLength: number
  packetType: number
  encrypt: number
  reserved: number
  body: T
  rawBody: string
}

export const decode = (hex: Uint8Array): Packet[] => {
  const buffer = Buffer.from(hex)
  const packetLength = buffer.readInt32LE(0)
  const realPacketLength = packetLength + 4
  const packetType = buffer.readInt16LE(4 + 4)
  const encrypt = buffer.readInt8(4 + 6)
  const reserved = buffer.readInt8(4 + 7)
  const rawBody = buffer.subarray(4 + 8, realPacketLength - 1).toString('utf8')

  const packets = [
    {
      packetLength,
      packetType,
      encrypt,
      reserved,
      body: deserialize(rawBody),
      rawBody,
    },
  ]

  if (realPacketLength < buffer.byteLength) {
    const restBuffer = buffer.subarray(realPacketLength)
    return packets.concat(decode(restBuffer))
  }

  return packets
}

export default {
  encode,
  decode,
}
