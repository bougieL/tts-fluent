export function createStorage<T>(key: string, defaultValue: T) {
  return {
    get(): T {
      const str = localStorage.getItem(key);
      if (!str) {
        return defaultValue;
      }
      try {
        return JSON.parse(str) as T;
      } catch (error) {
        // return str as unknown as T;
        return defaultValue;
      }
    },
    set(value: T) {
      try {
        const str = JSON.stringify(value);
        localStorage.setItem(key, str);
      } catch (error) {}
    },
    reset() {
      this.set(defaultValue);
    },
  };
}

export const STORAGE_KEYS = {
  micorsoftTts: 'microsoft_tts',
  ttsCat: 'tts_cat',
  ttsCatAiChat: 'tts_cat_ai_chat',
  themeVariant: 'theme_variant',
};
