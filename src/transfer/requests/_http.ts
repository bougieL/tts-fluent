import axios from 'axios';
import { isDev } from 'lib/utils';

export const http = axios.create({
  baseURL: isDev ? 'http://localhost:1236' : '',
});
