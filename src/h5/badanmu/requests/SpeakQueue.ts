import { baseURL } from './_http';

function getSpeakUrl(text: string) {
  const params = `${new URLSearchParams({
    outputFormat: 'audio-16khz-32kbitrate-mono-mp3',
    voice: 'zh-CN-XiaoshuangNeural',
    style: 'general',
    rate: '0%',
    pitch: '0%',
    text,
  }).toString()}`;

  return `${baseURL}/ttsCat?${params}`;
}

function getAiSpeakUrl(text: string) {
  const params = `${new URLSearchParams({
    outputFormat: 'audio-16khz-32kbitrate-mono-mp3',
    voiceA: 'zh-CN-XiaoshuangNeural',
    voiceB: 'zh-CN-XiaoxiaoNeural',
    text,
  }).toString()}`;

  return `${baseURL}/ttsCat/aiChat?${params}`;
}

export class SpeakQueue {
  private list: string[] = [];

  private audio = new Audio();

  private aiChat: boolean;

  constructor(options?: { aiChat: boolean }) {
    this.aiChat = !!options?.aiChat;
    this.audio.addEventListener('ended', () => {
      this.list.shift();
      this.playfirst();
    });
    // this.audio.addEventListener('error', (error) => {
    //   alert(String(error));
    // });
  }

  private playfirst() {
    const url = this.list[0];
    if (url) {
      this.audio.src = url;
      this.audio.play();
    }
  }

  add(text: string) {
    const url = this.aiChat ? getAiSpeakUrl(text) : getSpeakUrl(text);

    this.list.push(url);
    if (this.list.length === 1) {
      this.playfirst();
    }
  }
}
