export namespace HUYA {
  class UserId {
    constructor()
    lUid: number
    sGuid: string
    sToken: string
    sHuYaUA: string
    sCookie: string
  }
  class WSVerifyCookieReq {
    constructor()
    lUid: number
    sUA: string
    sCookie: string
  }

  class GetPropsListReq {
    constructor()

    tUserId: HUYA.UserId
    sMd5: string
    iTemplateType: 64
    sVersion: string
    iAppId: 0
    lPresenterUid: 0
    lSid: 0
    lSubSid: 0
  }

  const EClientTemplateType = {
    TPL_PC: number,
    TPL_WEB: number,
    TPL_JIEDAI: number,
    TPL_TEXAS: number,
    TPL_MATCH: number,
    TPL_HUYAAPP: number,
    TPL_MIRROR: number,
  }

  class WebSocketCommand {
    iCmdType: number

    vData: Taf.BinBuffer

    writeTo: (stream: Taf.JceOutputStream) => void
    readFrom: (view: Taf.jceInputStream) => void
  }

  enum EWebSocketCommandType {
    EWSCmd_NULL = 0,
    EWSCmd_RegisterReq = 1,
    EWSCmd_RegisterRsp = 2,
    EWSCmd_WupReq = 3,
    EWSCmd_WupRsp = 4,
    EWSCmdC2S_HeartBeat = 5,
    EWSCmdS2C_HeartBeatAck = 6,
    EWSCmdS2C_MsgPushReq = 7,
    EWSCmdC2S_DeregisterReq = 8,
    EWSCmdS2C_DeRegisterRsp = 9,
    EWSCmdC2S_VerifyCookieReq = 10,
    EWSCmdS2C_VerifyCookieRsp = 11,
    EWSCmdC2S_VerifyHuyaTokenReq = 12,
    EWSCmdS2C_VerifyHuyaTokenRsp = 13,
    EWSCmdC2S_UNVerifyReq = 14,
    EWSCmdS2C_UNVerifyRsp = 15,
    EWSCmdC2S_RegisterGroupReq = 16,
    EWSCmdS2C_RegisterGroupRsp = 17,
    EWSCmdC2S_UnRegisterGroupReq = 18,
    EWSCmdS2C_UnRegisterGroupRsp = 19,
    EWSCmdC2S_HeartBeatReq = 20,
    EWSCmdS2C_HeartBeatRsp = 21,
    EWSCmdS2C_MsgPushReq_V2 = 22,
    EWSCmdC2S_UpdateUserExpsReq = 23,
    EWSCmdS2C_UpdateUserExpsRsp = 24,
    EWSCmdC2S_WSHistoryMsgReq = 25,
    EWSCmdS2C_WSHistoryMsgRsp = 26,
    EWSCmdS2C_EnterP2P = 27,
    EWSCmdS2C_EnterP2PAck = 28,
    EWSCmdS2C_ExitP2P = 29,
    EWSCmdS2C_ExitP2PAck = 30,
    EWSCmdC2S_SyncGroupReq = 31,
    EWSCmdS2C_SyncGroupRsp = 32,
    EWSCmdC2S_UpdateUserInfoReq = 33,
    EWSCmdS2C_UpdateUserInfoRsp = 34,
  }

  class WSUserInfo {
    lUid = 0
    bAnonymous = !0
    sGuid = ''
    sToken = ''
    lTid = 0
    lSid = 0
    lGroupId = 0
    lGroupType = 0

    writeTo: (t: af.JceOutputStream) => void
  }
  class UserHeartBeatReq {
    tId: HUYA.UserId
    lTid = 0
    lSid = 0
    lShortTid = 0
    lPid = 0
    bWatchVideo = !1
    eLineType = HUYA.EStreamLineType.STREAM_LINE_OLD_YY
    iFps = 0
    iAttendee = 0
    iBandwidth = 0
    iLastHeartElapseTime = 0
  }

  const EStreamLineType = {
    STREAM_LINE_OLD_YY: 0,
    STREAM_LINE_WS: 1,
    STREAM_LINE_NEW_YY: 2,
    STREAM_LINE_AL: 3,
    STREAM_LINE_HUYA: 4,
  }

  class NobleBase {
    lUid = 0
    sNickName = ''
    iLevel = 0
    sName = ''
    iPet = 0
    lPid = 0
    lTid = 0
    lSid = 0
    lStartTime = 0
    lEndTime = 0
    iLeftDay = 0
    iStatus = 0
    iOpenFlag = 0
  }

  class LiveLaunchRsp {}
  class NobleSpeakResp {}
  class GetPropsListRsp {}
  class UserHeartBeatRsp {}
  class GetLivingInfoRsp {}

  class NobleEnterNotice {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class NobleSpeakBrst {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class SendItemSubBroadcastPacket {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class SendItemNoticeWordBroadcastPacket {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class EnterPushInfo {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class VipBarListRsp {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class WeekRankListRsp {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class WeekRankEnterBanner {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class FansRankListRsp {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class BadgeInfo {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class BadgeScoreChanged {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class FansInfoNotice {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class UserGiftNotice {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class GiftBarRsp {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class MessageNotice {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class AttendeeCountNotice {
    readFrom: (stream: Taf.JceInputStream) => void
    body?: any
    code?: number
    sContent?: string;
    [k: string]: any
  }
  class WSVerifyCookieRsp {
    iValidate: number
    readFrom: (stream: Taf.JceInputStream) => void
  }
  class WSRegisterGroupReq {
    sToken: string
    vGroupId: Taf.Vector
    writeTo: (stream: Taf.JceOutputStream) => void
  }
  class WSPushMessage {
    ePushType: number
    iUri:
      | 1002
      | 1003
      | 1005
      | 6501
      | 6052
      | 6200
      | 6210
      | 6220
      | 6221
      | 6230
      | 6231
      | 6232
      | 6233
      | 6234
      | 6250
      | 1400
      | 8006

    ePushType: number
    iProtocolType: number
    sGroupId: string
    lMsgId: number
    iMsgTag: number
    sMsg: Taf.BinBuffer
    readFrom: (jceInputStream: Taf.JceInputStream) => void
  }

  class VideoGatewayProxy2VGPingReq {
    constructor()

    lLocalTime: number

    readFrom(jceInputStream: Taf.JceInputStream): void

    writeTo(jceInputStream: Taf.JceInputStream): void
  }
}

export namespace Taf {
  class BinBuffer {
    constructor(t?: ArrayBuffer): void
    buf: ArrayBufferLike | null
    buffer: ArrayBufferLike | null
    vew: DataView | null
    len: 0
    position: 0
    vew: DataView
    len: number
    position: number
    length: number
  }

  class Wup {
    iVersion: number
    cPacketType: number
    iMessageType: number
    iRequestId: number
    sServantName: string
    sFuncName: 'doLaunch' | 'speak' | 'getPropsList' | 'OnUserHeartBeat' | 'getLivingInfo'
    sBuffer: Taf.BinBuffer
    iTimeout: number
    context: Taf.Map
    status: Taf.Map
    data: Taf.Map
    newdata: Taf.Map

    setServant: (servant: string) => void
    setFunc: (sFuncName: string) => void
    writeStruct: (cmd: string, cb: () => void) => void
    readStruct: (t: string, map: any, d: any) => void

    encode: () => Taf.BinBuffer

    decode: (view: ArrayBufferLike | null) => void
  }

  class JceOutputStream {
    buf: Taf.BinBuffer
    getBinBuffer: () => Taf.BinBuffer
    getBuffer: () => ArrayBuffer

    writeTo: (t: number, e: number) => void
  }

  class JceInputStream {
    constructor(t: ArrayBuffer | null): void
    buf: Taf.BinBuffer
    readInt32: (n: number, b: boolean, d?: number) => number
  }

  class Vector {
    constructor(t: string)
    proto: string
    value: string[]
  }
}

export const TafMx = {
  UriMapping: {
    1002: HUYA.NobleEnterNotice,
    1003: HUYA.NobleSpeakBrst,
    1005: HUYA.NobleEnterNotice,
    6501: HUYA.SendItemSubBroadcastPacket,
    6052: HUYA.SendItemNoticeWordBroadcastPacket,
    6200: HUYA.EnterPushInfo,
    6210: HUYA.VipBarListRsp,
    6220: HUYA.WeekRankListRsp,
    6221: HUYA.WeekRankEnterBanner,
    6230: HUYA.FansRankListRsp,
    6231: HUYA.BadgeInfo,
    6232: HUYA.BadgeScoreChanged,
    6233: HUYA.FansInfoNotice,
    6234: HUYA.UserGiftNotice,
    6250: HUYA.GiftBarRsp,
    1400: HUYA.MessageNotice,
    8006: HUYA.AttendeeCountNotice,
  },

  WupMapping: {
    doLaunch: HUYA.LiveLaunchRsp,
    speak: HUYA.NobleSpeakResp,
    getPropsList: HUYA.GetPropsListRsp,
    OnUserHeartBeat: HUYA.UserHeartBeatRsp,
    getLivingInfo: HUYA.GetLivingInfoRsp,
  },
}

export class List {
  constructor()
}
