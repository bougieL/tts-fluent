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
