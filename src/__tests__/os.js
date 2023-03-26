// const os = require('os');
const { Readable } = require('stream');
const fs = require('fs');

// console.log(os.userInfo(), os.platform(), os.hostname());

// const str = String(1);
// const buf = Buffer.from(str, 'ascii');

// console.log(buf)

const arr = Array(100)
  .fill('')
  .map((_, index) => index);

console.log(arr);

// let b = 0;

// const stream = new Readable();

// for (let i = 0; i < arr.length; i += 1) {
//   stream.push(String(arr[i]) || null);
// }

// stream._read = () => {};

// stream.pipe(process.stdout);

// class MyStream extends Readable {
//   constructor() {
//     super();
//     for (let i = 0; i < arr.length; i += 1) {
//       this.push(String(arr[i]) || null);
//     }
//   }

//   _read() {}
// }

// const mStream = new MyStream();

// mStream.pipe(process.stdout);

// setTimeout(() => {
//   console.log('\n========')
//   mStream.pipe(process.stdout);
// });

const m = fs.createReadStream('./aiChat.test.js');

m.pipe(process.stdout);

setTimeout(() => {
  console.log('\n========');
  m.pipe(process.stdout);
}, 1000);
