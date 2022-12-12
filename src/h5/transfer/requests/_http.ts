import axios from 'axios';
import md5 from 'md5';
import { v4 } from 'uuid';

const deviceId = v4();

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? `http://${process.env.HOST_IP}:1236`
    : '';

export const http = axios.create({
  baseURL,
  withCredentials: true,
  params: {
    deviceId,
    deviceName: getDeviceName(),
  },
});

export function getDeviceName() {
  const matche = navigator.userAgent.match(/^[^(]+\((\w+)/)?.[1];
  return `${matche ? `${matche}@` : ''}${md5(navigator.userAgent)}`;
}

export const baseQuery = `deviceId=${deviceId}&deviceName=${getDeviceName()}`;
