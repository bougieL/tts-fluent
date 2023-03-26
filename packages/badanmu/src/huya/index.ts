import WebSocket from 'ws'
import fetch from 'node-fetch'

import { HUYA, Taf, TafMx } from './lib'
import { getCommetMsg, getGiftMsg } from './helper'
// import { log2 } from '../log'
import Client, { Gift, Comment } from '../client'
import toArrayBuffer from './to-arraybuffer'

type ID = string | number

type ChatInfo = {
  subsid: number
  topsid: number
  yyuid: number
}

const heartbeat_interval = 60 * 1000
const fresh_gift_interval = 60 * 60 * 1000

const MSG_CACHE = [] as ID[]

const cachedMsg = (id: ID): boolean => {
  if (MSG_CACHE.includes(id)) {
    return true
  } else {
    MSG_CACHE.push(id)
    MSG_CACHE.splice(500, MSG_CACHE.length - 500)
    return false
  }
}

const userAgent =
  'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36'
export default class Huya extends Client {
  static url = 'wss://cdnws.api.huya.com'
  platform_id = '10002'
  clientName = '接收线程'
  // client?: WebSocket
  _main_user_id: HUYA.UserId
  chatInfo = {} as ChatInfo
  heartbeatTimer?: NodeJS.Timeout
  freshGiftListTimer?: NodeJS.Timeout
  isLogin = false
  isRun = true
  room_id: ID
  nickname: string
  cookies: string
  startTime: number
  // _chat_list: List

  constructor(roomID: ID) {
    super('huya', roomID)
    this.nickname = ''
    this.cookies = ''
    this.startTime = Date.now()
    // this._chat_list = new List()

    this.room_id = roomID
    this._main_user_id = new HUYA.UserId()
    this.getChatInfo()
      .then((info) => {
        this.chatInfo = info
        this._main_user_id.lUid = info.yyuid
        this._main_user_id.sHuYaUA = 'webh5&1.0.0&websocket'
      })
      .then(() => {
        this.client = this.createClient()
      })
      .catch((e) => {
        // log2.log('出错了')
        // log2.error(e)
        this.emit('error', e)
      })
  }

  getChatInfo(): Promise<ChatInfo> {
    return fetch(`https://m.huya.com/${this.room_id}`, {
      headers: { 'User-Agent': userAgent },
    })
      .then((t) => t.text())
      .then((body) => {
        const GLOBAL_INIT = body.match(/window.HNF_GLOBAL_INIT\s?=\s?(.+)<\/script>/)
        if (!GLOBAL_INIT) return Promise.reject('没找到页面信息')
        const globalInit = JSON.parse(GLOBAL_INIT[1])

        return {
          subsid: 0,
          topsid: 0,
          yyuid: globalInit.roomProfile.lUid,
        }
      })
  }

  createClient = (): WebSocket => {
    const client = new WebSocket('ws://ws.api.huya.com')

    client.on('open', () => {
      this.requestGiftInfo()
      this.requestWsInfo()
      this.requestChatInfo()
      this.freshGiftListTimer = setInterval(this.requestGiftInfo.bind(this), fresh_gift_interval)

      this.heartbeat()
      this.heartbeatTimer = setInterval(this.heartbeat.bind(this), heartbeat_interval)
      this.emit('open')
    })

    client.on('error', (hasError) => {
      // log2.log('error', hasError)
      this.emit('error', hasError)
    })

    client.on('close', (code, reason) => {
      // log2.log('close', code, reason)
      this.emit('close', code, reason)
      this.client?.close()
    })

    client.on('message', (data) => {
      try {
        const buffer = toArrayBuffer(data as Buffer)
        let stream = new Taf.JceInputStream(buffer)
        const command = new HUYA.WebSocketCommand()
        command.readFrom(stream)

        switch (command.iCmdType) {
          // case HUYA.EWebSocketCommandType.EWSCmd_WupRsp:
          //   try {
          //     const wup = new Taf.Wup()
          //     wup.decode(command.vData.buffer)
          //     const map = new TafMx.WupMapping[wup.sFuncName]()
          //     wup.readStruct('tRsp', map, TafMx.WupMapping[wup.sFuncName])
          //     this.emit(wup.sFuncName, map)
          //   } catch (e) {
          //     log2.error('返回方法处理异常', e)
          //   }
          //   break
          case HUYA.EWebSocketCommandType.EWSCmdS2C_MsgPushReq: {
            this.isLogin = true
            stream = new Taf.JceInputStream(command.vData.buffer)
            const msg = new HUYA.WSPushMessage()
            msg.readFrom(stream)
            const { iUri: code, sMsg, lMsgId } = msg
            const TargetFn = TafMx.UriMapping[code]
            if (!TargetFn) {
              return
            }

            stream = new Taf.JceInputStream(sMsg.buffer)
            const mapStream = new TargetFn()
            mapStream.readFrom(stream)
            let message: Gift | Comment | undefined
            if (mapStream?.sPropsName) {
              message = getGiftMsg({ code, body: mapStream as any })
            } else if (mapStream.body?.sPropsName) {
              message = getGiftMsg(mapStream)
            } else if (mapStream.sContent) {
              message = getCommetMsg({ code, body: mapStream })
            }

            if (message && !cachedMsg(lMsgId)) {
              this.emit('message', message)
            }
            break
          }
          // case HUYA.EWebSocketCommandType.EWSCmdS2C_VerifyCookieRsp: {
          //   stream = new Taf.JceInputStream(command.vData.buffer)
          //   const g = new HUYA.WSVerifyCookieRsp()
          //   g.readFrom(stream)
          //   this.isLogin = g.iValidate == 0
          //   if (this.isLogin) {
          //     log2.info(this.roomInfo() + '登录成功')
          //     this.emit('loginSuccess')
          //     this.heartbeat()
          //     this.heartbeatTimer = setInterval(this.heartbeat.bind(this), heartbeat_interval)
          //   } else {
          //     log2.info(this.roomInfo() + '登录失败')
          //     this.emit('loginFail')
          //     this.isRun = false
          //     this.exit()
          //   }
          //   break
          // }
          default:
            break
        }
      } catch (e) {
        // log2.error('接收信息出错', e)
      }
    })

    return client
  }

  exit(): void {
    this.isRun = false
    this.isLogin = false
    if (this.client) {
      this.client.close()
    }
  }

  requestGiftInfo(): void {
    const prop_req = new HUYA.GetPropsListReq()
    prop_req.tUserId = this._main_user_id
    prop_req.iTemplateType = HUYA.EClientTemplateType.TPL_MIRROR
    this.send_wup('PropsUIServer', 'getPropsList', prop_req)
  }

  requestWsInfo(): void {
    let jce_stream = new Taf.JceOutputStream()
    const ws_command = new HUYA.WebSocketCommand()
    ws_command.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_RegisterReq
    ws_command.vData = jce_stream.getBinBuffer()
    jce_stream = new Taf.JceOutputStream()
    ws_command.writeTo(jce_stream)
    this.client?.send(jce_stream.getBuffer())
  }

  requestChatInfo(): void {
    const t = new HUYA.WSRegisterGroupReq()
    t.vGroupId.value.push('live:' + this.chatInfo.yyuid)
    t.vGroupId.value.push('chat:' + this.chatInfo.yyuid)

    let e = new Taf.JceOutputStream()
    t.writeTo(e)

    const i = new HUYA.WebSocketCommand()
    i.iCmdType = HUYA.EWebSocketCommandType.EWSCmdC2S_RegisterGroupReq
    i.vData = e.getBinBuffer()

    e = new Taf.JceOutputStream()
    i.writeTo(e)

    this.client?.send(e.getBuffer())
  }

  heartbeat = (): void => {
    if (!this.isRun) {
      this.exit()
      return
    }
    const currTime = Date.now()
    if (currTime - this.startTime > 30 * 1000 && !this.isLogin) {
      // log2.info(this.roomInfo() + '登录超时')
      this.exit()
      return
    }
    const req = new HUYA.VideoGatewayProxy2VGPingReq()
    req.lLocalTime = (0.001 * currTime) >> 0
    this.send_wup('videogateway', 'videoGatewayProxy2VGPing', req)
  }

  send_wup(action: string, callback: string, req: any): void {
    try {
      const wup = new Taf.Wup()
      wup.setServant(action)
      wup.setFunc(callback)
      wup.writeStruct('tReq', req as any)
      const command = new HUYA.WebSocketCommand()
      command.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_WupReq
      command.vData = wup.encode()
      const stream = new Taf.JceOutputStream()
      command.writeTo(stream)
      this.client?.send(stream.getBuffer())
    } catch (err) {
      this.emit('error', err as any)
    }
  }
}
