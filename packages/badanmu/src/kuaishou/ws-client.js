import WebSocket from 'ws'
import protobuf from 'protobufjs'

import regeneratorRuntime from './regenerator-runtime'
import protoJSON from '../kuaishou.proto.json'
import EventEmitter from 'events'

const b = protobuf.Root.fromJSON(protoJSON)
const C = b.lookupType('SocketMessage')

var S = {
  CS_ENTER_ROOM: {
    key: 200,
    value: b.lookupType('CSWebEnterRoom'),
  },
  CS_HEARTBEAT: {
    key: 1,
    value: b.lookupType('CSWebHeartbeat'),
  },
  CS_USER_EXIT: {
    key: 202,
    value: b.lookupType('CSWebUserExit'),
  },
}

function B(t) {
  return (
    (B =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (t) {
          return typeof t
        }
        : function (t) {
          return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
            ? 'symbol'
            : typeof t
        }),
    B(t)
  )
}
function F(t, e, n, r, o, i, a) {
  try {
    var s = t[i](a),
      c = s.value
  } catch (t) {
    return void n(t)
  }
  s.done ? e(c) : Promise.resolve(c).then(r, o)
}
function N(t) {
  return function () {
    var e = this,
      n = arguments
    return new Promise(function (r, o) {
      var i = t.apply(e, n)
      function a(t) {
        F(i, r, o, a, s, 'next', t)
      }
      function s(t) {
        F(i, r, o, a, s, 'throw', t)
      }
      a(void 0)
    })
  }
}
function z(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n]
    ;(r.enumerable = r.enumerable || !1),
    (r.configurable = !0),
    'value' in r && (r.writable = !0),
    Object.defineProperty(t, r.key, r)
  }
}
function H(t, e) {
  return (
    (H =
      Object.setPrototypeOf ||
      function (t, e) {
        return (t.__proto__ = e), t
      }),
    H(t, e)
  )
}
function U(t, e) {
  return !e || ('object' !== B(e) && 'function' != typeof e)
    ? (function (t) {
      if (void 0 === t) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')
      return t
    })(t)
    : e
}
function W() {
  if ('undefined' == typeof Reflect || !Reflect.construct) return !1
  if (Reflect.construct.sham) return !1
  if ('function' == typeof Proxy) return !0
  try {
    return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
  } catch (t) {
    return !1
  }
}
function Q(t) {
  return (
    (Q = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t)
      }),
    Q(t)
  )
}

export const WsClient = (function (t) {
  !(function (t, e) {
    if ('function' != typeof e && null !== e) throw new TypeError('Super expression must either be null or a function')
    ;(t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: !0,
        configurable: !0,
      },
    })),
    e && H(t, e)
  })(n, t)
  var e = (function (t) {
    return function () {
      var e,
        n = Q(t)
      if (W()) {
        var r = Q(this).constructor
        e = Reflect.construct(n, arguments, r)
      } else e = n.apply(this, arguments)
      return U(this, e)
    }
  })(n)
  function n(t) {
    var r,
      o = t.webSocketUrls,
      i = void 0 === o ? [] : o,
      a = t.timeout,
      s = void 0 === a ? 1e4 : a
    return (
      (function (t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
      })(this, n),
      (r = e.call(this)),
      (r.ws = null),
      (r.heartbeatInterval = 2e4),
      (r.isClientClose = !1),
      (r.wsList = []),
      (r.webSocketUrls = i),
      (r.timeout = s),
      r
    )
  }
  return (
    (function (t, e, n) {
      e && z(t.prototype, e), n && z(t, n)
    })(n, [
      {
        key: 'connect',
        value: (function () {
          var t = N(
            regeneratorRuntime.mark(function t() {
              var e,
                n,
                r,
                o,
                i = this
              return regeneratorRuntime.wrap(
                function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (this.webSocketUrls.length) {
                          t.next = 2
                          break
                        }
                        throw new Error('\'webSocketUrls\' should not be empty')
                      case 2:
                        return (
                          (this.wsList = this.webSocketUrls.map(function (t) {
                            return new WebSocket(t)
                          })),
                          (e = this.wsList.map(function (t) {
                            return new Promise(function (e) {
                              try {
                                ;(t.onopen = function () {
                                  return e(t)
                                }),
                                (t.onerror = function (t) {
                                  return console.log(t)
                                })
                              } catch (t) {
                                console.log(t)
                              }
                            })
                          })),
                          (n = new Promise(function (t, e) {
                            setTimeout(function () {
                              e(new Error('WebSocket timeout'))
                            }, i.timeout)
                          })),
                          (r = Promise.race(e)),
                          (t.prev = 6),
                          (t.next = 9),
                          Promise.race([n, r])
                        )
                      case 9:
                        return (t.next = 11), r
                      case 11:
                        return (o = t.sent), t.abrupt('return', o)
                      case 13:
                        return (
                          (t.prev = 13),
                          this.wsList.forEach(function (t) {
                            t !== o && t.close()
                          }),
                          t.finish(13)
                        )
                      case 16:
                      case 'end':
                        return t.stop()
                    }
                },
                t,
                this,
                // eslint-disable-next-line no-sparse-arrays
                [[6, , 13, 16]]
              )
            })
          )
          return function () {
            return t.apply(this, arguments)
          }
        })(),
      },
      {
        key: 'open',
        value: (function () {
          var t = N(
            regeneratorRuntime.mark(function t() {
              var e = this
              return regeneratorRuntime.wrap(
                function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (t.next = 2), this.connect()
                      case 2:
                        ;(this.ws = t.sent),
                        (this.ws.binaryType = 'arraybuffer'),
                        (this.ws.onclose = function (t) {
                          e.emit('close', {
                            event: t,
                            isClientClose: e.isClientClose,
                          })
                        }),
                        (this.ws.onerror = function (t) {
                          e.emit('error', t)
                        }),
                        (this.ws.onmessage = function (t) {
                          var n = t.data
                          if ('string' == typeof n)
                            try {
                              n = JSON.parse(n)
                            } catch (t) {
                              console.error(t)
                            }
                          e.emit('message', n)
                        })
                      case 7:
                      case 'end':
                        return t.stop()
                    }
                },
                t,
                this
              )
            })
          )
          return function () {
            return t.apply(this, arguments)
          }
        })(),
      },
      {
        key: 'close',
        value: function () {
          ;(this.isClientClose = !0),
          this.heartbeatInterval && clearInterval(this.heartbeatIntervalId),
          this.ws
            ? this.ws.close()
            : this.wsList.forEach(function (t) {
              return t.close()
            })
        },
      },
      {
        key: 'heartbeat',
        value: function (t) {
          var e = this
          this.heartbeatIntervalId = setInterval(function () {
            e.send({
              type: 'CS_HEARTBEAT',
              timestamp: Date.now().valueOf(),
            })
          }, t || this.heartbeatInterval)
        },
      },
      {
        key: 'send',
        value: function (t) {
          this.ws &&
            this.isOpen &&
            this.ws.send(
              (function (t) {
                var e = S[t.type].value,
                  n = S[t.type].key,
                  r = e.encode(t.payload || t).finish(),
                  o = {
                    payloadType: n,
                    payload: r,
                  },
                  i = C.encode(o).finish()
                return i.slice().buffer
              })(t)
            )
        },
      },
      {
        key: 'isOpen',
        get: function () {
          return this.ws && 1 === this.ws.readyState
        },
      },
    ]),
    n
  )
})(EventEmitter)
