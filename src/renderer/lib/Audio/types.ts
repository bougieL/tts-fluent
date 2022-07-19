export enum AudioStatus {
  empty,
  playing,
  paused,
  stopped,
  error,
}

export type StatusChangeCallback = (status: AudioStatus) => void;
