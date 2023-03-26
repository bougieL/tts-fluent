import createClient from './createClient'



function connect(...params: any[]) {
  console.error(...params)
  /**
   * bilibili
   * 谷歌 139
   * C酱 213
   * edzhang 5050
   * xiao 15012554
   * me 250002
   */
  const client = createClient('bilibili', 250002)

  client.on('open', () => console.log('connected'))

  client.on('message', msg => {
    console.log(msg)
  })

  client.on('close', (code, reason) => {
    if (code === 0) {
      return
    }
    setTimeout(connect, 5000)
  })

  client.on('error', (...params) => {
    console.error(...params)
    // setTimeout(connect, 5000)
  })
}

connect()
