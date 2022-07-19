import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { GlobalAudio } from 'renderer/lib/Audio/GlobalAudio';

const audioContext = createContext(new GlobalAudio());

export function AudioProvider(props: PropsWithChildren<any>) {
  const audioRef = useRef(new GlobalAudio());
  return <audioContext.Provider value={audioRef.current} {...props} />;
}

export function useAudio() {
  return useContext(audioContext);
}
