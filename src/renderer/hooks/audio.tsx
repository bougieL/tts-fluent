import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';
import { LocalAudio } from 'renderer/lib/Audio/LocalAudio';
import { StreamAudio } from 'renderer/lib/Audio/StreamAudio';

const isStreamAudioContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

const audioContext = createContext(new LocalAudio());

const streamAudioContext = createContext(new StreamAudio());

export function AudioProvider(props: PropsWithChildren<any>) {
  const audioRef = useRef(new LocalAudio());
  const streamAudioRef = useRef(new StreamAudio());
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

  return {
    isStreamAudio,
    setIsStreamAudio,
    audio,
    streamAudio,
  };
}
