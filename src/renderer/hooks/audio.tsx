import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';

import { BufferAudio } from 'renderer/lib/Audio/BufferAudio';
import { LocalAudio } from 'renderer/lib/Audio/LocalAudio';

const isStreamAudioContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

const audioContext = createContext(new LocalAudio());

const streamAudioContext = createContext(new BufferAudio());

export function AudioProvider(props: PropsWithChildren<any>) {
  const audioRef = useRef(new LocalAudio());
  const streamAudioRef = useRef(new BufferAudio());
  return (
    <isStreamAudioContext.Provider value={useState<boolean>(false)}>
      <streamAudioContext.Provider value={streamAudioRef.current}>
        <audioContext.Provider value={audioRef.current} {...props} />
      </streamAudioContext.Provider>
    </isStreamAudioContext.Provider>
  );
}

export function useAudio() {
  const [isStreamAudio, setIsStreamAudio] = useContext(isStreamAudioContext);
  const audio = useContext(audioContext);
  const streamAudio = useContext(streamAudioContext);
  const resetAudio = () => {
    audio.stop();
    streamAudio.reset();
  };

  return {
    isStreamAudio,
    setIsStreamAudio,
    audio,
    streamAudio,
    resetAudio,
  };
}
