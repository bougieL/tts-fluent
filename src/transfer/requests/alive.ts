import { TransferType } from 'const/Transfer';
import { baseURL, getDeviceId, getDeviceName, http } from './_http';

export function deviceAlivePolling() {
  return http.get('/transfer/deviceAlivePolling', {
    timeout: 10000,
  });
}

export function serverAliveSse(
  onReceiveData?: (data: { type: TransferType; payload: any }) => void
) {
  const source = new EventSource(
    `${baseURL}/transfer/serverAliveSse?deviceId=${getDeviceId()}&deviceName=${getDeviceName()}`,
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
