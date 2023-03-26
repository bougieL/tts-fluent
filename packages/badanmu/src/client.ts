import EventEmiter from 'events'
import WebSocket from 'ws'

export type ID = number | string

export interface UserInfo {
  userName?: string
  userId?: ID
  gender?: number
  avatar?: string
}

export interface Noble {
  // 贵族名称
  name: string
  // 类型
  type: number
  // 等级
  level: number
}

interface Msg {
  type: 'comment' | 'gift' | 'system'
  code: number
  data: string
  playerName: string
  commonType: number

  uuid: string
  ts: number
  userInfo?: UserInfo
  nobel?: Partial<Noble>

  [k: string]: unknown
}

export interface Comment extends Msg {
  type: 'comment'
}

export interface Gift extends Msg {
  type: 'gift'
  giftName: string
  /**
   * 总数 = 连击单位数 x 连击次数
   */
  num: number
  /**
   * 连击单位数，默认为 1
   * @type {number}
   */
  combo: number
  /**
   * 连击次数，默认为 1
   * @type {number}
   */
  comboTimes: number
}

export interface SystemInfo extends Msg {
  type: 'system'
  msgType: number
}

export type Message = Comment | Gift | SystemInfo

export type Packet = {
  packetLen: number
  headerLen: number
  ver: number
  op: number
  seq: number
  body: Message
}

export default abstract class Client extends EventEmiter {
  roomID: ID
  platform: string
  client?: WebSocket
  constructor(platform: string, roomID: ID) {
    super()
    if (!platform) throw Error('no parameter "platform"')
    if (!roomID) throw Error('no parameter "roomID"')
    this.platform = platform
    this.roomID = roomID
  }

  roomInfo(): string {
    return `${this.platform || ''}平台，${this.roomID}房间`
  }

  stop(code?: number, data?: string): void {
    this.client?.close(code, data)
  }

  emit(event: 'open'): boolean
  emit(event: 'close', code: number, reason: string): boolean
  emit(event: 'error', error: Error): boolean
  emit(event: 'login', success: boolean): boolean
  emit(event: 'logout', success: boolean): boolean
  emit(event: 'requireLogin', data: string): boolean
  emit(event: 'message', data: Gift | Comment | SystemInfo): boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args)
  }

  on(event: 'open', listener: () => void): this
  on(event: 'close', listener: (code: number, reason: string) => void): this
  on(event: 'error', listener: (error: Error) => void): this
  on(event: 'login', listener: (success: boolean) => void): this
  on(event: 'logout', listener: () => void): this
  on(event: 'requireLogin', listener: (data: string) => void): this
  on(event: 'message', listener: (messages: Message) => void): this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }
}
