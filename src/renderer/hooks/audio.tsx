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

// export function useAudio() {
//   const audio = useContext(streamAudioContext);

//   const oriPipe = audio.pipe;

//   const customPipe: typeof audio['pipe'] = useCallback(
//     (...params) => {
//       return oriPipe(...params);
//     },
//     [oriPipe]
//   );

//   audio.pipe = customPipe;

//   return audio;
// }
