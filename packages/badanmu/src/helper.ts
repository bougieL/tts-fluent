export const enum CommonType {
  DEFAULT = 1000,
  //连接挂起
  CONECT_HOLD = 1001,

  //接入 刷僵尸
  ADDNPC_ZOMBIE = 100,
  //接入 刷士兵
  ADDNPC_SOLIDER = 101,
  //接入 刷血
  BUFF_HP = 200,
  BUFF_AMMO = 201,

  ENTER = 300,
  FOLLOW = 301,
}

export const getCommonType = (comment: string): CommonType => {
  if (comment.match(/僵尸/)) {
    return CommonType.ADDNPC_ZOMBIE
  } else if (comment.match(/(枪手|士兵)/)) {
    return CommonType.ADDNPC_SOLIDER
  } else if (comment.match(/6|主播真棒|加油|加血/)) {
    return CommonType.BUFF_HP
  } else {
    return 0
  }
}

export const stringify = (value: unknown): string => {
  if (value === '') {
    return ''
  }

  try {
    return JSON.stringify(value)
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const uuid = (base?: number): string => {
  const now = base ?? Date.now()
  const rand = Math.floor(Math.random() * 99999 + 999)
  return [now, rand].map((n) => n.toString(32)).join('_')
}
