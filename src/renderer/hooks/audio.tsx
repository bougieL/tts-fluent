import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { StreamAudio } from 'renderer/lib/Audio/StreamAudio';

import { useFn } from './useFn';

export const audioContext = createContext(new StreamAudio());

export const getAudioContext = createContext(() => new StreamAudio());

export function AudioProvider({ children }: PropsWithChildren) {
  const [audio, setAudio] = useState(new StreamAudio());

  const getAudio = useFn(() => {
    audio.stop();
    const newAudio = new StreamAudio();
    setAudio(newAudio);
    return newAudio;
  });

  return (
    <audioContext.Provider value={audio}>
      <getAudioContext.Provider value={getAudio}>
        {children}
      </getAudioContext.Provider>
    </audioContext.Provider>
  );
}

export function useGetAudio() {
  return useContext(getAudioContext);
}
