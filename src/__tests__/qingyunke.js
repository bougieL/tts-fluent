const axios = require('axios').default;

axios
  .get('http://api.qingyunke.com/api.php', {
    params: {
      key: 'free',
      appid: 0,
      msg: '这种画质是如何做到的',
    },
  })
  .then(({ data }) => console.log(data))
  .catch(console.error);
