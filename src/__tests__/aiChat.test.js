const axios = require('axios').default;

axios
  .get('http://api.qingyunke.com/api.php', {
    params: {
      key: 'free',
      appid: 0,
      msg: '你是谁？',
    },
  })
  .then(({ data }) => console.log(data))
  .catch(console.error);

// https://api.aa1.cn/doc/api-xiaoai.html
// axios
//   .get('https://v.api.aa1.cn/api/api-xiaoai/talk.php', {
//     params: {
//       msg: '点歌',
//       type: 'json',
//     },
//   })
//   .then(({ data }) => console.log(data))
//   .catch(console.error);

// https://apibug.cn/doc/xiaoai.html
// axios
//   .get('https://apibug.cn/api/xiaoai/', {
//     params: {
//       msg: '你是谁？',
//       apiKey: 'x',
//     },
//   })
//   .then(({ data }) => console.log(data))
//   .catch(console.error);
