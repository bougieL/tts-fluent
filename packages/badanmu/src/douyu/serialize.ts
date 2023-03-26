import { DataType, MessageType, MessageValue } from './packet'

const escape = (v: DataType) => {
  return v.toString().replace(/@/g, '@A').replace(/\//g, '@S')
}

const unescape = (v: DataType) => {
  return v.toString().replace(/@A/g, '@').replace(/@S/g, '/')
}

export const serialize = (raw: MessageType | DataType): string => {
  if (Object.prototype.toString.call(raw).slice(8, -1) === 'Object') {
    return Object.entries(raw)
      .map(([k, v]) => `${k}@=${serialize(v)}`)
      .join('')
  } else if (Array.isArray(raw)) {
    return raw.map(serialize).join('')
  } else {
    return escape(raw.toString()) + '/'
  }
}

export const deserialize = (raw: string): MessageValue => {
  if (raw.includes('//')) {
    return raw
      .split('//')
      .filter((e) => e !== '')
      .map((item) => deserialize(item) as DataType)
  }

  if (raw.includes('@=')) {
    return raw
      .split('/')
      .filter((e) => e !== '')
      .reduce((o, s) => {
        const [k, v] = unescape(s).split('@=')
        o[unescape(k)] = v ? (deserialize(unescape(v)) as MessageValue) : ''
        return o
      }, {} as MessageType)
  } else {
    return unescape(raw)
  }
}
