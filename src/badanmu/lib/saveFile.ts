export function saveByFileReader(data: any, filename: string): Promise<void> {
  const blob = new Blob([data]);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const a = document.createElement('a');
      if (event.target?.result) {
        a.href = event.target.result as string;
        a.download = filename;
        a.click();
        resolve();
      } else {
        reject(new Error('Get data url failed'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function saveByObjectUrl(data: any, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data]);
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function saveByUrl(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
