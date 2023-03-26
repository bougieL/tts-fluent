import Bilibili from './bilibili'
import Douyu from './douyu'
import Huya from './huya'
import Kuaishou from './kuaishou'

type Client = Bilibili | Douyu | Huya | Kuaishou

type RoomID = number | string

function createClient(platform: 'bilibili', roomId: RoomID): Bilibili
function createClient(platform: 'douyu', roomId: RoomID): Douyu
function createClient(platform: 'huya', roomId: RoomID): Huya
function createClient(platform: 'kuaishou', roomId: RoomID): Kuaishou
function createClient(platform: string, roomId: RoomID): Client
function createClient(platform: string, roomId: RoomID): Client {
  let upstream: Client
  if (platform === 'bilibili') {
    upstream = new Bilibili(roomId)
  } else if (platform === 'douyu') {
    upstream = new Douyu(roomId)
  } else if (platform === 'huya') {
    upstream = new Huya(roomId)
  } else if (platform === 'kuaishou') {
    upstream = new Kuaishou(roomId)
  } else {
    throw new Error(`Unknown platform ${platform}`)
  }
  return upstream
}

export default createClient
