import { BadanmuType } from 'const/Badanmu';

import { baseQuery, baseURL, http } from './_http';

export function deviceAlivePolling() {
  return http.get('/badanmu/deviceAlivePolling', {
    timeout: 10000,
  });
}

export function serverAliveSse(
  onReceiveData?: (data: { type: BadanmuType; payload: any }) => void
) {
  const source = new EventSource(`${baseURL}/badanmu/message?${baseQuery}`, {
    withCredentials: true,
  });
  source.onopen = () => {
    console.log('event source open');
  };
  source.onmessage = ({ data }) => {
    onReceiveData?.(JSON.parse(data));
  };
}

export function getSpeakUrl(text: string) {
  const params = `${new URLSearchParams({
    outputFormat: 'audio-16khz-32kbitrate-mono-mp3',
    voice: 'zh-CN-XiaoshuangNeural',
    style: 'general',
    rate: '0%',
    pitch: '0%',
    text,
  }).toString()}`;

  return `${baseURL}/ttsCat?${params}`;
}
