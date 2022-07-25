import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { LocalAudio } from 'renderer/lib/Audio/LocalAudio';
import { StreamAudio } from 'renderer/lib/Audio/StreamAudio';
import { AudioStatus } from 'renderer/lib/Audio/types';

const audioContext = createContext(new LocalAudio());

const streamAudioContext = createContext(new StreamAudio());

export function AudioProvider(props: PropsWithChildren<any>) {
  const audioRef = useRef(new LocalAudio());
  const streamAudioRef = useRef(new StreamAudio());
  return (
    <streamAudioContext.Provider value={streamAudioRef.current}>
      <audioContext.Provider value={audioRef.current} {...props} />
    </streamAudioContext.Provider>
  );
}

export function useAudio() {
  const audio = useContext(audioContext);
  const streamAudio = useContext(streamAudioContext);
  const isStreamRef = useRef(false);
  return useRef({
    setSource(src: string) {
      isStreamRef.current = false;
      audio.setSource(src);
      streamAudio.reset();
    },
    appendStream(chunk: ArrayBuffer) {
      isStreamRef.current = true;
      streamAudio.appendStream(chunk);
    },
    play(isStream = false) {
      if (isStream) {
        streamAudio.play();
        audio.stop();
      } else {
        audio.play();
        streamAudio.stop();
      }
    },
    stop() {
      streamAudio.stop();
      audio.stop();
    },
    addStatusChangeListener(listener: (status: AudioStatus) => void) {
      const s1 = audio.addStatusChangeListener((status) => {
        if (!isStreamRef.current) {
          listener(status);
        }
      });
      const s2 = streamAudio.addStatusChangeListener((status) => {
        if (isStreamRef.current) {
          listener(status);
        }
      });
      return {
        remove() {
          s1.remove();
          s2.remove();
        },
      };
    },
  }).current;
}
