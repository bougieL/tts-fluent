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
        return str as T;
      }
    },
    set(value: T) {
      try {
        const str = JSON.stringify(value);
        localStorage.setItem(key, str);
      } catch (error) {}
    },
  };
}
