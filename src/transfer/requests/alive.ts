import { TransferType } from 'const/Transfer';
import { baseQuery, baseURL, http } from './_http';

export function deviceAlivePolling() {
  return http.get('/transfer/deviceAlivePolling', {
    timeout: 10000,
  });
}

export function serverAliveSse(
  onReceiveData?: (data: { type: TransferType; payload: any }) => void
) {
  const source = new EventSource(
    `${baseURL}/transfer/serverAliveSse?${baseQuery}`,
    {
      withCredentials: true,
    }
  );
  source.onopen = () => {
    console.log('event source open');
  };
  source.onmessage = ({ data }) => {
    onReceiveData?.(JSON.parse(data));
  };
}
