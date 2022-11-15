import { createContext, PropsWithChildren, useContext, useRef } from 'react';

import { StreamAudio } from 'renderer/lib/Audio/StreamAudio';

export const streamAudioContext = createContext(new StreamAudio());

export function AudioProvider({ children }: PropsWithChildren) {
  const streamAudioRef = useRef(new StreamAudio());

  return (
    <streamAudioContext.Provider value={streamAudioRef.current}>
      {children}
    </streamAudioContext.Provider>
  );
}

let globalSessionId = '';

export function useGetAudio() {
  const audio = useContext(streamAudioContext);

  return (sessionId: string) => {
    if (sessionId !== globalSessionId || !audio.streamEnd) {
      audio.reset();
    }
    globalSessionId = sessionId;
    return audio;
  };
}
