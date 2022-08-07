import { baseQuery, baseURL, http } from './_http';

export function getClipboard() {
  return http.get('/transfer/clipboard');
}

export function sendClipboard(text: string) {
  return http.post('/transfer/clipboard', { data: text });
}

export function sendFiles(form: any, onUploadProgress?: (event: any) => void) {
  return http.post('/transfer/files', form, { onUploadProgress });
}

export async function getFile(
  p: string,
  onDownloadProgress?: (event: any) => void
) {
  const res = await http.get(`/transfer/file/${encodeURIComponent(p)}`, {
    responseType: 'blob',
    timeout: 0,
    onDownloadProgress,
  });
  console.log(`fetch end: ${p}`)
  return res.data;
}

export function getFileDownloadUrl(p: string) {
  return `${baseURL}/transfer/file/${encodeURIComponent(p)}?${baseQuery}`;
}

export async function fetchFile(
  p: string,
  onDownloadProgress?: (event: any) => void
) {
  const url = getFileDownloadUrl(p);
  const blob = await fetch(url).then(async (res) => {
    if (onDownloadProgress) {
      const reader = res.clone().body?.getReader();
      const total = res.headers.get('Content-Length');
      let loaded = 0;
      if (reader) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          loaded += value?.length || 0;
          if (done) {
            break;
          }
          onDownloadProgress({ loaded, total });
        }
      }
    }
    return res.blob();
  });
  return blob;
}
