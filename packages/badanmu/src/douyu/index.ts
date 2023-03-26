import WebSocket from 'ws'

import { MessageType, decode, encode } from './packet'
import { parseMsg } from './helper'
import { serialize } from './serialize'
import Client from '../client'

type ID = string | number

export default class Douyu extends Client {
  static get apiURL(): string {
    const port = 8500 + ((min, max) => Math.floor(Math.random() * (max - min + 1) + min))(1, 6)
    return `wss://danmuproxy.douyu.com:${port}/`
  }

  static HEARBEAT_INTERVAL = 45
  private _heartbeatTask: NodeJS.Timeout | undefined
  public client: WebSocket
  public joined = false

  constructor(roomID: ID) {
    super('douyu', roomID)

    this.client = new WebSocket(Douyu.apiURL)

    this.listen()
  }

  listen(): void {
    this.client.on('message', (data) => {
      const packets = decode(data as Uint8Array)
      packets.map((packet) => {
        const msg = parseMsg(packet?.body as MessageType)
        if (msg) this.emit('message', msg)
      })

      const [{ body = {} } = {}] = packets
      // 服务端返回的消息目前都是对象字面量，不存在数组或字符串形式
      // 为了类型安全强制做个校验
      if (!this.joined && typeof body === 'object' && !Array.isArray(body) && body.type === 'loginres') {
        this.joinGroup()
        this.joined = true
      }
    })
    this.client.on('open', () => {
      this.login()
      this.heartbeat()
      this.emit('open')
    })
    this.client.on('error', (error) => {
      this.cleaup()
      this.emit('error', error)
    })
    this.client.on('close', (code, reason) => {
      this.cleaup()
      this.emit('close', code, reason)
      this.client.close()
    })
  }

  send(data: MessageType): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client?.send(encode(serialize(data)), (error?: Error) => {
        if (error) {
          return reject(error)
        }
        resolve(true)
      })
    })
  }

  login = (): void => {
    this.send({ type: 'loginreq', roomid: this.roomID })
  }

  logout = (): void => {
    this.send({ type: 'logout' })
    this.cleaup()
  }

  cleaup = (): void => {
    this._heartbeatTask && clearInterval(this._heartbeatTask)
    this.joined = false
  }

  heartbeat = (interval = Douyu.HEARBEAT_INTERVAL): void => {
    const delay = interval * 1000
    this._heartbeatTask = setInterval(() => this.send({ type: 'mrkl' }), delay)
  }

  joinGroup = (gid = -9999): void => {
    this.send({ type: 'joingroup', rid: this.roomID, gid })
  }
}
