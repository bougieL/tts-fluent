import { Gift, Comment } from '../client'
import { MessageType } from './packet'
import { uuid } from '../helper'
import giftIdNameMap from './gift-id-name-map.json'

const getGiftName = (id: string) => {
  return (giftIdNameMap as Record<string, string>)[id] || '未知礼物'
}

export type Msg = {
  type: string
  [k: string]: string
}

const parseComment = (rawMsg: Msg): Comment => {
  const { nn, uid, rid, txt, nl, gt } = rawMsg

  return {
    type: 'comment',
    code: -1,
    commonType: -1,
    playerName: nn as string,
    userInfo: { userName: nn as string, userId: parseInt(uid) },
    nobel: {
      name: gt as string,
      level: parseInt(nl),
    },
    data: txt as string,
    ts: Date.now(),
    roomId: rid,
    uuid: uuid(),
  }
}

const parseGift = (rawMsg: Msg): Gift => {
  const { nn, uid, rid, gfid, gfcnt = '1', hits = '1' } = rawMsg
  const giftName = getGiftName(gfid)

  return {
    type: 'gift',
    code: 200,
    playerName: nn,
    data: `礼物：${giftName} ${gfcnt}个`,
    giftName: giftName,
    giftId: gfid,
    num: parseInt(gfcnt),
    combo: parseInt(hits),
    comboTimes: 1,
    commonType: 200,
    ts: Date.now(),
    uuid: uuid(),
    roomId: rid,
    userInfo: {
      userName: nn,
      userId: uid,
    },
  }
}

export const parseMsg = (rawMsg: MessageType): Gift | Comment | null => {
  if (typeof rawMsg !== 'object') {
    return null
  }
  const { type } = rawMsg
  if (type === 'chatmsg') {
    return parseComment(rawMsg as Msg)
  } else if (type === 'dgb') {
    return parseGift(rawMsg as Msg)
  }
  return null
}
