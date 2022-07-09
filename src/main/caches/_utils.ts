import { app } from 'electron';
import path from 'path';
// import fs from 'fs-extra';

const userData = app.getPath('userData');

export const cachesDir = path.join(userData, 'tts-fluent');

// export function createCache<T>(p: string) {
//   return {
//     set(value: T) {
//       fs.ensureFileSync(p);
//       if (typeof value === 'string') {
//         fs.writeFileSync(p, value);
//         return;
//       }
//       try {
//         fs.writeFileSync(p, JSON.stringify(value));
//       } catch (error) {
//         console.error(error);
//       }
//     },
//     get(): T {
//       const value = fs.readFileSync(p, 'utf-8');
//       try {
//         return JSON.parse(value);
//       } catch (error) {
//         return value as unknown as T;
//       }
//     },
//   };
// }
