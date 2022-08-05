import axios from 'axios';
import { v4 } from 'uuid';
import md5 from 'md5';
import { isDev } from 'lib/utils';

export const baseURL = isDev ? `http://${process.env.HOST_IP}:1236` : '';

export const http = axios.create({
  baseURL,
  withCredentials: true,
  params: {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
  },
});

export function getDeviceId() {
  const KEY = 'deviceId';
  let deviceId = localStorage.getItem(KEY);
  if (!deviceId) {
    deviceId = v4();
    localStorage.setItem(KEY, deviceId);
  }
  return deviceId;
}

export function getDeviceName() {
  const matche = navigator.userAgent.match(/^[^(]+\((\w+)/)?.[1];
  return `${matche ? `${matche}@` : ''}${md5(navigator.userAgent)}`;
}

export const baseQuery = `deviceId=${getDeviceId()}&deviceName=${getDeviceName()}`;
