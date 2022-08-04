import { http } from './_http';

export function getClipboard() {
  return http.get('/transfer/clipboard');
}

export function sendClipboard(text: string) {
  return http.post('/transfer/clipboard', { data: text });
}

export function sendFiles(form: any) {
  return http.post('/transfer/files', form);
}

export async function getFile(
  p: string,
  onDownloadProgress?: (event: any) => void
) {
  const res = await http.get(`/transfer/file/${encodeURIComponent(p)}`, {
    // responseType: 'stream',
    onDownloadProgress,
  });
  // console.log('typeof res.data', typeof res.data);
  return res.data;
}
