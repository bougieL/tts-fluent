import pako from 'pako'

import { Comment, Gift, SystemInfo } from '../client'
import { CommonType, uuid } from '../helper'

/**
 * 回传消息数据包
 * 弹幕和人气值等信息
 */
export type DanmuPacket = {
  packetLen: number
  headerLen: number
  ver: number
  op: number
  seq: number
  body: { count: number; messages: any[] }
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const readInt = function (buffer: Uint8Array, start: number, len: number): number {
  let result = 0
  for (let i = len - 1; i >= 0; i--) {
    result += Math.pow(256, len - i - 1) * buffer[start + i]
  }
  return result
}

export const writeInt = function (buffer: number[], start: number, len: number, value: number): void {
  let i = 0
  while (i < len) {
    buffer[start + i] = value / Math.pow(256, len - i - 1)
    i++
  }
}

export const encode = function (str: string, op: number): ArrayBufferLike {
  const data = textEncoder.encode(str)
  const packetLen = 16 + data.byteLength
  const header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1]
  writeInt(header, 0, 4, packetLen)
  return new Uint8Array(header.concat(...data)).buffer
}

export const decode = (data: ArrayBuffer): DanmuPacket => {
  const buffer = new Uint8Array(data)
  const packetLen = readInt(buffer, 0, 4)
  const headerLen = readInt(buffer, 4, 2)
  const ver = readInt(buffer, 6, 2)
  const op = readInt(buffer, 8, 4)
  const seq = readInt(buffer, 12, 4)
  const result = {
    packetLen,
    headerLen,
    ver,
    op,
    seq,
    body: { count: 0, messages: [] },
  } as DanmuPacket

  if (result.op === 5) {
    // 弹幕、广播等全部信息
    let offset = 0
    while (offset < buffer.length) {
      const packetLen = readInt(buffer, offset + 0, 4)
      const headerLen = readInt(buffer, offset + 4, 2) // 16
      const chunk = buffer.slice(offset + headerLen, offset + packetLen)
      let body = [] as string[]
      if (ver === 0 || ver === 1) {
        body = [textDecoder.decode(chunk)]
      } else if (ver === 2) {
        const content = textDecoder.decode(pako.inflate(chunk)) || ''
        // console.log(content, typeof content)
        body = content.split(/[\x00-\x1f]+/)
      }
      // console.log(body)
      if (body.length) {
        // body = body.filter((s) => s.startsWith('{') && s.endsWith('}'))

        // const parse = (s: string) => s && JSON.parse(s)
        result.body.messages = body
          .map((item) => {
            try {
              const result = JSON.parse(item)
              return typeof result === 'object' ? result : false
            } catch (error) {
              return false
            }
          })
          .filter(Boolean)
      }
      offset += packetLen
    }
  } else if (op === 3) {
    // 房间人气值
    result.body.count = readInt(buffer, 16, buffer.length)
  }

  return result
}

export const parseComment = (rawMsg: any[]): Comment => {
  // console.log(rawMsg)
  return {
    type: 'comment',
    code: -1,
    commonType: -1,
    data: rawMsg[1],
    avatar: undefined,
    image: rawMsg[0][13]?.url,
    playerName: rawMsg[2][1],
    ts: Date.now(),
    uuid: uuid(),
  }
}

export const parseGift = (rawMsg: Record<string, any>): Gift => {
  const { giftName, giftType, giftId, super_gift_num, super_batch_gift_num, batch_combo_id, uname, num, face } = rawMsg
  return {
    type: 'gift',
    code: 200,
    commonType: 200,
    ts: Date.now(),
    commentId: giftId,
    giftName,
    giftType,
    avatar: face,
    playerName: uname,
    num: parseInt(num) || 1,
    combo: super_gift_num || 1,
    comboTimes: super_batch_gift_num || 1,
    data: `礼物：${giftName} ${num}个`,
    batchId: batch_combo_id,
    uuid: uuid(),
  }
}

export const parseSystemInfo = (rawMsg: Record<string, any>): SystemInfo => {
  const { uname, msg_type } = rawMsg
  let data = '进入直播间'
  if (msg_type === 2) {
    data = '关注直播间'
  }

  return {
    type: 'system',
    code: 200,
    data,
    playerName: uname,
    commonType: 200,
    msgType: msg_type, // 1 - 進入直播間，2 - 關注直播間
    uuid: uuid(),
    ts: Date.now(),
  }
}

export const parseLiveInfo = (rawMsg: Record<string, any>): SystemInfo => {
  const { cmd, roomid } = rawMsg
  const isStart = cmd === 'LIVE'

  return {
    type: 'system',
    code: 200,
    data: (isStart ? '直播已开始' : '直播已结束') + `，房间 ${roomid}`,
    playerName: '',
    commonType: 200,
    msgType: isStart ? 101 : 102,
    uuid: uuid(),
    ts: Date.now(),
  }
}
