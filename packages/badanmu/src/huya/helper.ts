import { Gift, Comment } from '../client'
import { uuid } from '../helper'

type GiftMsg = {
  /**
   * 送礼物者用户名
   */
  sSenderNick: string
  /**
   * 礼物名
   */
  sPropsName: string
  /**
   * 礼物总数
   */
  iItemCount: number
  /**
   * 连击单位数
   */
  iItemGroup: number
  /**
   * 连击次数
   * @type {number}
   */
  iItemCountByGroup: number

  sNickName: string
  lUid: number

  sNobleName: string
  iNobleLevel: number
  iNobleType: number

  sContent: string

  [key: string]: any
}

export const getGiftMsg = (packet: { code?: number; body?: GiftMsg }): Gift => {
  const {
    code = -1,
    body: {
      sSenderNick,
      lSenderUid,
      sPropsName,
      iItemCount,
      iItemGroup,
      iItemCountByGroup,
      sNobleName,
      iNobleLevel,
      iNobleType,
    } = {} as GiftMsg,
  } = packet

  return {
    type: 'gift',
    playerName: sSenderNick,
    num: iItemCount,
    giftName: sPropsName,
    data: `礼物:${sPropsName} ${iItemCount}个`,
    commonType: 200,
    combo: iItemGroup,
    comboTimes: iItemCountByGroup,

    code,
    ts: Date.now(),
    uuid: uuid(),
    userInfo: {
      userName: sSenderNick,
      userId: lSenderUid,
    },
    nobel: {
      name: sNobleName,
      type: iNobleType,
      level: iNobleLevel,
    },
  }
}

export const getCommetMsg = (packet: { code?: number; body?: Record<string, any> }): Comment => {
  const {
    code = -1,
    body: { sContent, tUserInfo: { lUid, sNickName, iGender } = {} as Record<string, any> } = {} as Record<string, any>,
  } = packet

  return {
    type: 'comment',
    code,
    data: sContent,
    playerName: sNickName,
    userInfo: {
      userName: sNickName,
      userId: lUid,
      gender: iGender,
    },
    ts: Date.now(),
    commonType: -1,
    uuid: uuid(),
  }
}
