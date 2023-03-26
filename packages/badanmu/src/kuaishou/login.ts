import fetch from 'node-fetch'

type QrCodeInfo = {
  result: number
  expireTime: number
  qrLoginSignature: string
  imageData: string
  callback: string
  qrLoginToken: string
  sid: string
}

const getQrCode = (): Promise<QrCodeInfo> => {
  return fetch('https://id.kuaishou.com/rest/c/infra/ks/qr/start', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: 'sid=kuaishou.live.web',
    method: 'POST',
  }).then((r) => r.json())
}

type ScanResult = {
  result: number
  user: {
    user_id: number
  }
}

const scanResult = (qrLoginToken: string, qrLoginSignature: string): Promise<ScanResult> => {
  return fetch('https://id.kuaishou.com/rest/c/infra/ks/qr/scanResult', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: `qrLoginToken=${qrLoginToken}&qrLoginSignature=${qrLoginSignature}`,
    method: 'POST',
  }).then((r) => r.json())
}

type AcceptResult = {
  result: number
  qrToken: string
  callback: null
  sid: string
}
const acceptResult = (qrLoginToken: string, qrLoginSignature: string, sid: string): Promise<AcceptResult> => {
  return fetch('https://id.kuaishou.com/rest/c/infra/ks/qr/acceptResult', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: `qrLoginToken=${qrLoginToken}&qrLoginSignature=${qrLoginSignature}&sid=${sid}`,
    method: 'POST',
  }).then((r) => r.json())
}

export type SessionInfo = {
  result: number
  ssecurity: string
  passToken: string
  stsUrl: string
  followUrl: string
  'kuaishou.live.web_st': string
  userId: number
  'kuaishou.live.web.at': string
}
const callback = (qrToken: string, sid: string): Promise<SessionInfo> => {
  return fetch('https://id.kuaishou.com/pass/kuaishou/login/qr/callback', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: `qrToken=${qrToken}&sid=${sid}`,
    method: 'POST',
  }).then((r) => r.json())
}

type OnScanQrCode = (img: string) => void
const login = (onScanQrCode: OnScanQrCode): Promise<SessionInfo> => {
  return getQrCode()
    .then((qr) => {
      onScanQrCode?.(qr.imageData)
      return qr
    })
    .then((qr) => {
      return scanResult(qr.qrLoginToken, qr.qrLoginSignature).then(() => {
        return acceptResult(qr.qrLoginToken, qr.qrLoginSignature, qr.sid).then((ares) =>
          callback(ares.qrToken, ares.sid)
        )
      })
    })
}

export default login
