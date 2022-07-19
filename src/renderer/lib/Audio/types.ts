export enum AudioStatus {
  empty,
  loading,
  playing,
  paused,
  stopped,
  error,
}

export type StatusChangeCallback = (status: AudioStatus) => void;
