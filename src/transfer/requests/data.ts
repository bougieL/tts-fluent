import { http } from './_http';

export function getClipboard() {
  return http.get('/transfer/clipboard');
}

export function sendClipboard(text: string) {
  return http.post('/transfer/clipboard', { data: text });
}
