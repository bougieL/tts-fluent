// prettier-ignore
const decodeLib = {
  cipher: {},
  hash: {},
  keyexchange: {},
  mode: {},
  misc: {},
  codec: {},
  exception: {
    corrupt: function(t) {
      this.toString = function() {
        return "CORRUPT: " + this.message
      }
      ,
      this.message = t
    },
    invalid: function(t) {
      this.toString = function() {
        return "INVALID: " + this.message
      }
      ,
      this.message = t
    },
    bug: function(t) {
      this.toString = function() {
        return "BUG: " + this.message
      }
      ,
      this.message = t
    },
    notReady: function(t) {
      this.toString = function() {
        return "NOT READY: " + this.message
      }
      ,
      this.message = t
    }
  }
};
decodeLib.cipher.aes = function (t) {
  this._tables[0][0][0] || this._precompute()
  var e,
    n,
    o,
    i,
    a,
    s = this._tables[0][4],
    c = this._tables[1],
    u = t.length,
    l = 1
  if (4 !== u && 6 !== u && 8 !== u) throw new decodeLib.exception.invalid('invalid aes key size')
  for (this._key = [(i = t.slice(0)), (a = [])], e = u; e < 4 * u + 28; e++)
    (o = i[e - 1]),
    (e % u == 0 || (8 === u && e % u == 4)) &&
        ((o = (s[o >>> 24] << 24) ^ (s[(o >> 16) & 255] << 16) ^ (s[(o >> 8) & 255] << 8) ^ s[255 & o]),
        e % u == 0 && ((o = (o << 8) ^ (o >>> 24) ^ (l << 24)), (l = (l << 1) ^ (283 * (l >> 7))))),
    (i[e] = i[e - u] ^ o)
  for (n = 0; e; n++, e--)
    (o = i[3 & n ? e : e - 4]),
    (a[n] =
        e <= 4 || n < 4 ? o : c[0][s[o >>> 24]] ^ c[1][s[(o >> 16) & 255]] ^ c[2][s[(o >> 8) & 255]] ^ c[3][s[255 & o]])
}

decodeLib.cipher.aes.prototype = {
  encrypt: function (t) {
    return this._crypt(t, 0)
  },
  decrypt: function (t) {
    return this._crypt(t, 1)
  },
  _tables: [
    [[], [], [], [], []],
    [[], [], [], [], []],
  ],
  _precompute: function () {
    var t,
      e,
      n,
      r,
      o,
      i,
      a,
      s,
      c,
      u = this._tables[0],
      l = this._tables[1],
      f = u[4],
      p = l[4],
      d = [],
      h = []
    for (t = 0; t < 256; t++) h[(d[t] = (t << 1) ^ (283 * (t >> 7))) ^ t] = t
    for (e = n = 0; !f[e]; e ^= r || 1, n = h[n] || 1)
      for (
        a = n ^ (n << 1) ^ (n << 2) ^ (n << 3) ^ (n << 4),
        a = (a >> 8) ^ (255 & a) ^ 99,
        f[e] = a,
        p[a] = e,
        i = d[(o = d[(r = d[e])])],
        c = (16843009 * i) ^ (65537 * o) ^ (257 * r) ^ (16843008 * e),
        s = (257 * d[a]) ^ (16843008 * a),
        t = 0;
        t < 4;
        t++
      )
        (u[t][e] = s = (s << 24) ^ (s >>> 8)), (l[t][a] = c = (c << 24) ^ (c >>> 8))
    for (t = 0; t < 5; t++) (u[t] = u[t].slice(0)), (l[t] = l[t].slice(0))
  },
  _crypt: function (t, e) {
    if (4 !== t.length) throw new decodeLib.exception.invalid('invalid aes block size')
    var n,
      o,
      i,
      a,
      s = this._key[e],
      c = t[0] ^ s[0],
      u = t[e ? 3 : 1] ^ s[1],
      l = t[2] ^ s[2],
      f = t[e ? 1 : 3] ^ s[3],
      p = s.length / 4 - 2,
      d = 4,
      h = [0, 0, 0, 0],
      v = this._tables[e],
      y = v[0],
      m = v[1],
      g = v[2],
      b = v[3],
      _ = v[4]
    for (a = 0; a < p; a++)
      (n = y[c >>> 24] ^ m[(u >> 16) & 255] ^ g[(l >> 8) & 255] ^ b[255 & f] ^ s[d]),
      (o = y[u >>> 24] ^ m[(l >> 16) & 255] ^ g[(f >> 8) & 255] ^ b[255 & c] ^ s[d + 1]),
      (i = y[l >>> 24] ^ m[(f >> 16) & 255] ^ g[(c >> 8) & 255] ^ b[255 & u] ^ s[d + 2]),
      (f = y[f >>> 24] ^ m[(c >> 16) & 255] ^ g[(u >> 8) & 255] ^ b[255 & l] ^ s[d + 3]),
      (d += 4),
      (c = n),
      (u = o),
      (l = i)
    for (a = 0; a < 4; a++)
      (h[e ? 3 & -a : a] =
        (_[c >>> 24] << 24) ^ (_[(u >> 16) & 255] << 16) ^ (_[(l >> 8) & 255] << 8) ^ _[255 & f] ^ s[d++]),
      (n = c),
      (c = u),
      (u = l),
      (l = f),
      (f = n)
    return h
  },
}

decodeLib.bitArray = {
  bitSlice: function (t, e, n) {
    return (
      (t = decodeLib.bitArray._shiftRight(t.slice(e / 32), 32 - (31 & e)).slice(1)),
      void 0 === n ? t : decodeLib.bitArray.clamp(t, n - e)
    )
  },
  extract: function (t, e, n) {
    var r,
      o = Math.floor((-e - n) & 31)
    return (
      (r =
        -32 & ((e + n - 1) ^ e) ? (t[(e / 32) | 0] << (32 - o)) ^ (t[(e / 32 + 1) | 0] >>> o) : t[(e / 32) | 0] >>> o),
      r & ((1 << n) - 1)
    )
  },
  concat: function (t, e) {
    if (0 === t.length || 0 === e.length) return t.concat(e)
    var n = t[t.length - 1],
      o = decodeLib.bitArray.getPartial(n)
    return 32 === o ? t.concat(e) : decodeLib.bitArray._shiftRight(e, o, 0 | n, t.slice(0, t.length - 1))
  },
  bitLength: function (t) {
    var e,
      n = t.length
    return 0 === n ? 0 : ((e = t[n - 1]), 32 * (n - 1) + decodeLib.bitArray.getPartial(e))
  },
  clamp: function (t, e) {
    if (32 * t.length < e) return t
    t = t.slice(0, Math.ceil(e / 32))
    var n = t.length
    return (e &= 31), n > 0 && e && (t[n - 1] = decodeLib.bitArray.partial(e, t[n - 1] & (2147483648 >> (e - 1)), 1)), t
  },
  partial: function (t, e, n) {
    return 32 === t ? e : (n ? 0 | e : e << (32 - t)) + 1099511627776 * t
  },
  getPartial: function (t) {
    return Math.round(t / 1099511627776) || 32
  },
  equal: function (t, e) {
    if (decodeLib.bitArray.bitLength(t) !== decodeLib.bitArray.bitLength(e)) return !1
    var n,
      o = 0
    for (n = 0; n < t.length; n++) o |= t[n] ^ e[n]
    return 0 === o
  },
  _shiftRight: function (t, e, n, o) {
    var i, a, s
    for (void 0 === o && (o = []); e >= 32; e -= 32) o.push(n), (n = 0)
    if (0 === e) return o.concat(t)
    for (i = 0; i < t.length; i++) o.push(n | (t[i] >>> e)), (n = t[i] << (32 - e))
    return (
      (a = t.length ? t[t.length - 1] : 0),
      (s = decodeLib.bitArray.getPartial(a)),
      o.push(decodeLib.bitArray.partial((e + s) & 31, e + s > 32 ? n : o.pop(), 1)),
      o
    )
  },
  _xor4: function (t, e) {
    return [t[0] ^ e[0], t[1] ^ e[1], t[2] ^ e[2], t[3] ^ e[3]]
  },
  byteswapM: function (t) {
    var e, n
    for (e = 0; e < t.length; ++e)
      (n = t[e]), (t[e] = (n >>> 24) | ((n >>> 8) & 65280) | ((65280 & n) << 8) | (n << 24))
    return t
  },
}

decodeLib.codec.utf8String = {
  fromBits: function (t) {
    var e,
      n,
      o = '',
      i = decodeLib.bitArray.bitLength(t)
    for (e = 0; e < i / 8; e++)
      0 == (3 & e) && (n = t[e / 4]), (o += String.fromCharCode(((n >>> 8) >>> 8) >>> 8)), (n <<= 8)
    return decodeURIComponent(escape(o))
  },
  toBits: function (t) {
    t = unescape(encodeURIComponent(t))
    var e,
      n = [],
      o = 0
    for (e = 0; e < t.length; e++) (o = (o << 8) | t.charCodeAt(e)), 3 == (3 & e) && (n.push(o), (o = 0))
    return 3 & e && n.push(decodeLib.bitArray.partial(8 * (3 & e), o)), n
  },
}

decodeLib.codec.base64 = {
  _chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  fromBits: function (t, e, n) {
    var o,
      i = '',
      a = 0,
      s = decodeLib.codec.base64._chars,
      c = 0,
      u = decodeLib.bitArray.bitLength(t)
    for (n && (s = s.substr(0, 62) + '-_'), o = 0; 6 * i.length < u; )
      (i += s.charAt((c ^ (t[o] >>> a)) >>> 26)),
      a < 6 ? ((c = t[o] << (6 - a)), (a += 26), o++) : ((c <<= 6), (a -= 6))
    for (; 3 & i.length && !e; ) i += '='
    return i
  },
  toBits: function (t, e) {
    t = t.replace(/\s|=/g, '')
    var n,
      o,
      i = [],
      a = 0,
      s = decodeLib.codec.base64._chars,
      c = 0
    for (e && (s = s.substr(0, 62) + '-_'), n = 0; n < t.length; n++) {
      if (((o = s.indexOf(t.charAt(n))), o < 0)) throw new decodeLib.exception.invalid("this isn't base64!")
      a > 26 ? ((a -= 26), i.push(c ^ (o >>> a)), (c = o << (32 - a))) : ((a += 6), (c ^= o << (32 - a)))
    }
    return 56 & a && i.push(decodeLib.bitArray.partial(56 & a, c, 1)), i
  },
}

decodeLib.codec.base64url = {
  fromBits: function (t) {
    return decodeLib.codec.base64.fromBits(t, 1, 1)
  },
  toBits: function (t) {
    return decodeLib.codec.base64.toBits(t, 1)
  },
}

decodeLib.mode.cbc = {
  name: 'cbc',
  encrypt: function (t, e, n, o) {
    if (o && o.length) throw new decodeLib.exception.invalid("cbc can't authenticate data")
    if (128 !== decodeLib.bitArray.bitLength(n)) throw new decodeLib.exception.invalid('cbc iv must be 128 bits')
    var i,
      a = decodeLib.bitArray,
      s = a._xor4,
      c = a.bitLength(e),
      u = 0,
      l = []
    if (7 & c) throw new decodeLib.exception.invalid('pkcs#5 padding only works for multiples of a byte')
    for (i = 0; u + 128 <= c; i += 4, u += 128)
      (n = t.encrypt(s(n, e.slice(i, i + 4)))), l.splice(i, 0, n[0], n[1], n[2], n[3])
    return (
      (c = 16843009 * (16 - ((c >> 3) & 15))),
      (n = t.encrypt(s(n, a.concat(e, [c, c, c, c]).slice(i, i + 4)))),
      l.splice(i, 0, n[0], n[1], n[2], n[3]),
      l
    )
  },
  decrypt: function (t, e, n, o) {
    if (o && o.length) throw new decodeLib.exception.invalid("cbc can't authenticate data")
    if (128 !== decodeLib.bitArray.bitLength(n)) throw new decodeLib.exception.invalid('cbc iv must be 128 bits')
    if (127 & decodeLib.bitArray.bitLength(e) || !e.length)
      throw new decodeLib.exception.corrupt('cbc ciphertext must be a positive multiple of the block size')
    var i,
      a,
      s,
      c = decodeLib.bitArray,
      u = c._xor4,
      l = []
    for (o = o || [], i = 0; i < e.length; i += 4)
      (a = e.slice(i, i + 4)), (s = u(n, t.decrypt(a))), l.splice(i, 0, s[0], s[1], s[2], s[3]), (n = a)
    if (((a = 255 & l[i - 1]), 0 === a || a > 16)) throw new decodeLib.exception.corrupt('pkcs#5 padding corrupt')
    if (
      ((s = 16843009 * a),
      !c.equal(c.bitSlice([s, s, s, s], 0, 8 * a), c.bitSlice(l, 32 * l.length - 8 * a, 32 * l.length)))
    )
      throw new decodeLib.exception.corrupt('pkcs#5 padding corrupt')
    return c.bitSlice(l, 0, 32 * l.length - 8 * a)
  },
}

'undefined' == typeof ArrayBuffer &&
  (function (t) {
    ;(t.ArrayBuffer = function () {}), (t.DataView = function () {})
  })(void 0)

decodeLib.codec.arrayBuffer = {
  fromBits: function (t, e, n) {
    var o, i, a, s, c
    if (((e = null == e || e), (n = n || 8), 0 === t.length)) return new ArrayBuffer(0)
    if (((a = decodeLib.bitArray.bitLength(t) / 8), decodeLib.bitArray.bitLength(t) % 8 != 0))
      throw new decodeLib.exception.invalid(
        'Invalid bit size, must be divisble by 8 to fit in an arraybuffer correctly'
      )
    for (
      e && a % n != 0 && (a += n - (a % n)), s = new DataView(new ArrayBuffer(4 * t.length)), i = 0;
      i < t.length;
      i++
    )
      s.setUint32(4 * i, t[i] << 32)
    if (((o = new DataView(new ArrayBuffer(a))), o.byteLength === s.byteLength)) return s.buffer
    for (c = s.byteLength < o.byteLength ? s.byteLength : o.byteLength, i = 0; i < c; i++) o.setUint8(i, s.getUint8(i))
    return o.buffer
  },
  toBits: function (t) {
    var e,
      n,
      o,
      i = []
    if (0 === t.byteLength) return []
    ;(n = new DataView(t)), (e = n.byteLength - (n.byteLength % 4))
    for (var a = 0; a < e; a += 4) i.push(n.getUint32(a))
    if (n.byteLength % 4 != 0) {
      o = new DataView(new ArrayBuffer(4))
      a = 0
      for (var s = n.byteLength % 4; a < s; a++) o.setUint8(a + 4 - s, n.getUint8(e + a))
      i.push(decodeLib.bitArray.partial((n.byteLength % 4) * 8, o.getUint32(0)))
    }
    return i
  },
  hexDumpBuffer: function (t) {
    for (
      var e = new DataView(t),
        r = '',
        o = function (t, e) {
          return (t += ''), t.length >= e ? t : new Array(e - t.length + 1).join('0') + t
        },
        i = 0;
      i < e.byteLength;
      i += 2
    )
      i % 16 == 0 && (r += '\n' + i.toString(16) + '\t'), (r += o(e.getUint16(i).toString(16), 4) + ' ')
    // void 0 === ("undefined" == typeof console ? "undefined" : n(console)) && (console = console || {
    //   log: function() {}
    // }),
    console.log(r.toUpperCase())
  },
}

module.exports.decodeLib = decodeLib
