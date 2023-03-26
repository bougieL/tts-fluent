import { filterXSS } from "xss";

export function escapeText(text: string) {
  let escapedText = filterXSS(text);
  escapedText = escapedText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  return escapedText;
}

export function textToSsml(
  text: string,
  options?: {
    voice?: string;
    style?: string;
    rate?: string;
    pitch?: string;
  }
) {
  const style = options?.style || "general";
  const voice = options?.voice || "zh-CN-XiaoxiaoNeural";
  const rate = options?.rate || "0%";
  const pitch = options?.pitch || "0%";
  const isGeneral = style === "general";
  const escapedText = escapeText(text);
  return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="${voice}">${
    isGeneral ? "" : `<mstts:express-as style="${style}" >`
  }<prosody rate="${rate}" pitch="${pitch}">${escapedText}</prosody>${
    isGeneral ? "" : "</mstts:express-as>"
  }</voice></speak>`;
}

export function ssmlToText(ssml: string) {
  return ssml.replace(/\<[\s\S\n\r]*?\>/gm, "");
}
