import { createClient } from 'badanmu';

const client = createClient('bilibili', 139);

client.on('open', () => {
  console.log('open');
});

client.on('close', () => {
  console.log('close');
});

client.on('message', (msg) => {
  console.log(msg);
});
