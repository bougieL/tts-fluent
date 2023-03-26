# badanmu

巴旦木/扒弹幕

## 使用

1. 启动服务器

```sh
npm run start [port]
```

2. 启动客户端

```ts
const ws = new WebSocket('ws://127.0.0.1:8181')
ws.on('open', () => {
  console.log(`连接成功 ${platform}, ${roomId}`)

  // 发送连接请求
  ws.send(socketData({ type: 'login', platform: 'bilibili', roomId: '213' }))
})
ws.on('error', console.error)
ws.on('close', console.log)
// 监听消息
ws.on('message', console.info)
```

## 消息格式说明

```ts
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

  ts: number
  userInfo?: UserInfo
  nobel?: Partial<Noble>

  [k: string]: any
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
}

export type Message = Comment | Gift | SystemInfo
```

[查看详情](http://gitlab.egret-inner.com/hushuibin/badanmu/blob/master/src/client.ts#L5-64)

## 发布

项目通过 tag 的形式发布

```sh
# 打 tag，tag 必须符合以 'release-v' 开始，后跟一个数字版本
git tag release-v0.1
# 提交 tag，触发自动部署 CI 脚本
git push origin release-v0.1
```

## 部署

此项目使用 pm2 部署，并配置 [nginx](./badnmu.conf) 来代理分发服务

pm2 一共启动了三个服务，分别在 8000、8001 和 8002 端口，如果某个服务不可用，nginx 会尝试重连到另一个服务

部署的思路是依次重启/启动服务，让线上最少有一个服务可用。可以通过简单得执行 `sh ./deloly.sh` 来执行此任务

## 已知问题

- 快手平台暂时未实现
