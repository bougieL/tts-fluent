import WebSocket from 'ws'

import { CommonType, getCommonType, stringify } from './helper'
import { Message } from './client'
import createClient from './createClient'
import log from './log'

const [port] = process.argv.slice(2)

type ClientMessage = {
  type?: string
  platform: string
  roomId: string | number
}

const parseClientMsg = (data: string) => {
  if (data === '') {
    return ''
  }
  try {
    return JSON.parse(data) as ClientMessage | string
  } catch (e) {
    log.error('parse client message failed', data)
    // throw Error(e)
    return null
  }
}

const addWSListener = (platform: string, roomId: number | string, ws: WebSocket) => {
  let upstream: ReturnType<typeof createClient> | undefined
  try {
    upstream = createClient(platform, roomId)
  } catch (error) {
    log.error(error)
  }

  if (!upstream) return

  upstream.platform = platform
  const roomInfo = upstream.roomInfo()
  log.info(`开始监听${roomInfo}`)

  const onMessage = (msg: Message) => {
    if (!msg) {
      return
    }
    const commonType = getCommonType(msg.data) as number
    const msgWithComType = stringify({ ...msg, commonType, roomId })

    log.info(`接收到${roomInfo}的消息`, msgWithComType)
    ws.send(msgWithComType)
  }
  const cleanup = () => {
    upstream?.off('message', onMessage)
    upstream?.stop()
  }

  upstream.once('open', () => {
    ws.send(stringify({ type: 'loginResponse', data: 'success', roomId }))
  })
  upstream.on('message', onMessage)
  upstream.once('close', (code, reason) => {
    cleanup()
    log.info(roomInfo, 'client closed', code, reason)
    ws.send(stringify({ type: 'close', code, data: reason }))
    ws.close()
  })
  upstream.on('error', (e) => {
    cleanup()
    log.error(roomInfo, 'client error', e)
    ws.send(stringify({ type: 'close', code: 1, data: e.message }))
  })

  ws.once('close', (code, reason) => {
    log.info(roomInfo, 'closed', code, reason)
    cleanup()
  })

  return upstream
}

const main = (port: number) => {
  const server = new WebSocket.Server({ port })

  log.info(`WebSocket 服务器正在监听 ${port} 端口`)

  server.on('error', (error) => {
    log.error('server error', error)
  })

  server.on('connection', (ws) => {
    log.info('收到连接请求')

    ws.send(stringify({ commonType: CommonType.CONECT_HOLD }))

    ws.on('message', (message) => {
      const requestBody = message.toString('utf8').trim()
      log.info('收到消息', requestBody)

      if (requestBody === '') {
        // 忽略空消息
        return
      } else if (requestBody === 'ping') {
        ws.send('pong')
        return
      }

      const msg = parseClientMsg(requestBody)

      if (!(msg && typeof msg === 'object')) {
        log.info('未知消息', requestBody)
        return ws.send('未知消息')
      }

      const { type, platform, roomId } = msg

      if (type === 'login' || (platform && roomId)) {
        if (platform && roomId) {
          addWSListener(platform, roomId, ws)
        } else {
          ws.send('参数错误')
        }
      } else if (type === 'clientSize') {
        ws.send(stringify({ type: 'clientSize', data: server.clients.size }))
      } else {
        log.info('其它消息', message)
      }
    })
  })
}

main(parseInt(port) || 8181)
