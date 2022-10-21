export function showMarkdown() {
  const w = window.open('/#/markdown', '', 'width=400,height=500');
  if (w) {
    // @ts-ignore
    w.global = w;
    // w.document.write('<h1>Hello</h1>');
    // w.document.title = 'change log';
  }
}
