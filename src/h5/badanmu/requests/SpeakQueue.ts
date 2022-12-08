import { getSpeakUrl } from './alive';

export class SpeakQueue {
  private list: string[] = [];

  private audio = new Audio();

  constructor() {
    this.audio.addEventListener('ended', () => {
      this.list.shift();
      this.playfirst();
    });
  }

  private playfirst() {
    const url = this.list[0];
    if (url) {
      this.audio.src = url;
      this.audio.play();
    }
  }

  add(text: string) {
    const url = getSpeakUrl(text);

    this.list.push(url);
    if (this.list.length === 1) {
      this.playfirst();
    }
  }
}
