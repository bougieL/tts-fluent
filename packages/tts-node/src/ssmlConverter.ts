// import axios from "axios";
import Websocket from "ws";
import * as uuid from "uuid";
import { Stream, Transform } from "stream";

function getXTime() {
  function p(n: number) {
    return String(n).padStart(2, "0");
  }
  function h(n: number) {
    return (n - 1) % 24;
  }
  const now = new Date();
  return `${now.getFullYear()}-${p(now.getMonth())}-${p(now.getDate())}T${p(
    h(now.getHours())
  )}:${p(now.getMinutes())}:${p(now.getSeconds())}.${String(
    now.getMilliseconds()
  ).slice(0, 3)}Z`;
}

function getReqHeaders() {
  return {
    Connection: "Upgrade",
    Upgrade: "websocket",
    Host: "eastus.api.speech.microsoft.com",
    Origin: "https://azure.microsoft.com",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
    "Sec-WebSocket-Version": 13,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24",
  };
}

async function getSocketUrl() {
  // const webUrl =
  //   "https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/?Voice&Voice";
  // const html: string = await axios
  //   .get(webUrl, {
  //     headers: {
  //       "User-Agent":
  //         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71",
  //     },
  //   })
  //   .then((res) => res.data);
  // // console.log(html);
  // const matches = html.match(/token: "(.*?)"/i);
  // const authToken = matches?.[1];
  // if (!authToken) {
  //   throw new Error('Get auth token failed')
  // }
  const reqId = uuid.v4().replace(/-/g, "").toUpperCase();
  return `wss://eastus.api.speech.microsoft.com/cognitiveservices/websocket/v1?TrafficType=AzureDemo&Authorization=bearer%20undefined&X-ConnectionId=${reqId}`;
  // return `wss://eastus.tts.speech.microsoft.com/cognitiveservices/websocket/v1?Authorization=${authToken}&X-ConnectionId=${reqId}`;
}

async function sendMessage({
  websocket,
  ssmlText,
  outputFormat,
}: {
  websocket: Websocket;
  ssmlText: string;
  outputFormat?: string;
}) {
  const reqId = uuid.v4().replace(/-/g, "").toUpperCase();
  const send = (data: string): Promise<Error | void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        websocket.send(data, (err) => {
          err ? reject(err) : resolve();
        });
      }, 500);
    });
  };

  const payload1 = JSON.stringify({
    context: {
      system: {
        name: "SpeechSDK",
        version: "1.19.0",
        build: "JavaScript",
        lang: "JavaScript",
      },
      os: {
        platform: "Browser/MacIntel",
        name: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71",
        version:
          "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71",
      },
    },
  });
  const message1 = `Path: speech.config\r\nX-RequestId: ${reqId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n${payload1}`;
  await send(message1);

  const payload2 = JSON.stringify({
    synthesis: {
      audio: {
        metadataOptions: {
          bookmarkEnabled: false,
          sentenceBoundaryEnabled: false,
          visemeEnabled: false,
          wordBoundaryEnabled: false,
        },
        // outputFormat: 'audio-16khz-32kbitrate-mono-mp3',
        outputFormat: outputFormat || "audio-24khz-96kbitrate-mono-mp3",
        // outputFormat: "audio-24khz-160kbitrate-mono-mp3", // audio-24khz-96kbitrate-mono-mp3
      },
      language: { autoDetection: false },
    },
  });
  const message2 = `Path: synthesis.context\r\nX-RequestId: ${reqId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n${payload2}`;
  await send(message2);

  const payload3 = ssmlText;
  const message3 = `Path: ssml\r\nX-RequestId: ${reqId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/ssml+xml\r\n\r\n${payload3}`;
  await send(message3);
}

function convertToBuffer(websocket: Websocket): Promise<Buffer> {
  let buffer = Buffer.from("", "utf-8");

  return new Promise((resolve, reject) => {
    websocket.onmessage = (event) => {
      try {
        const response = event.data as Buffer;
        if (!response.includes("Path:turn.end")) {
          const needle = "Path:audio\r\n";
          if (response.includes(needle)) {
            const startIndex = response.indexOf(needle) + needle.length;
            buffer = Buffer.concat([buffer, response.subarray(startIndex)]);
          }
        } else {
          websocket.close();
          resolve(buffer);
        }
      } catch (error) {
        reject(error);
      }
    };

    websocket.onclose = (event) => {
      if (event.code !== 0) {
        reject({
          code: event.code,
          reason: event.reason,
          type: event.type,
          wasClean: event.wasClean,
        });
      }
    };

    websocket.onerror = reject;
  });
}

export async function ssmlToBuffer(ssmlText: string, outputFormat?: string) {
  const socketUrl = await getSocketUrl();
  const websocket = new Websocket(socketUrl, {
    headers: getReqHeaders(),
  });
  websocket.onopen = (event) => {
    sendMessage({ websocket, ssmlText, outputFormat });
  };
  return convertToBuffer(websocket);
}

function convertToStream(websocket: Websocket): Transform {
  const stream = new Stream.Transform();
  websocket.onmessage = (event) => {
    const response = event.data as Buffer;
    if (!response.includes("Path:turn.end")) {
      const needle = "Path:audio\r\n";
      if (response.includes(needle)) {
        const startIndex = response.indexOf(needle) + needle.length;
        stream.push(response.subarray(startIndex));
      }
    } else {
      websocket.close();
      stream.end();
    }
  };

  websocket.onerror = (error) => {
    stream.destroy(new Error(error.message));
  };

  return stream;
}

export async function ssmlToStream(ssmlText: string, outputFormat?: string) {
  const socketUrl = await getSocketUrl();

  const websocket = new Websocket(socketUrl, {
    headers: getReqHeaders(),
  });
  websocket.onopen = (event) => {
    sendMessage({ websocket, ssmlText, outputFormat });
  };
  return convertToStream(websocket);
}
