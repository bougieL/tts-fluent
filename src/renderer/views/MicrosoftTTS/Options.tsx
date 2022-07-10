import { Dropdown, Slider, Stack, Toggle } from '@fluentui/react';
import list from '@bougiel/tts-node/lib/ssml/list';
import { useEffect, useMemo, useState } from 'react';

const locales = list
  .map((item) => {
    return {
      key: item.LocaleName,
      text: item.LocaleName,
    };
  })
  .reduce<Array<{ key: string; text: string }>>((acc, cur) => {
    return acc.find((item) => item.key === cur.key) ? acc : acc.concat(cur);
  }, [])
  .sort((a, b) => (a.text > b.text ? 1 : -1));

function getVoicesByLocale(locale: string) {
  return list
    .filter((item) => item.LocaleName === locale)
    .map((item) => {
      return {
        key: item.ShortName,
        text: `${item.LocalName} - ${item.DisplayName}`,
      };
    });
}

function getStyles(name: string) {
  return [{ key: 'genreal', text: 'General' }].concat(
    (list.find((item) => item.ShortName === name)?.StyleList || []).map(
      (item) => {
        return {
          key: item,
          text: item.replace(/^(\w)/, ($1) => $1.toUpperCase()),
        };
      }
    )
  );
}

export interface SsmlConfig {
  voice: string;
  style: string;
  rate: string;
  pitch: string;
}

interface Props {
  onChange: (value: SsmlConfig) => void;
}

enum ConfigKey {
  locale = 'locale',
  voice = 'voice',
  style = 'style',
  speed = 'speed',
  pitch = 'pitch',
}

const prefix = 'microsoft_tts';

const setStorage = (key: ConfigKey, value: string) =>
  localStorage.setItem(`${prefix}_${key}`, value);

const getStorage = (key: ConfigKey) => {
  const value = localStorage.getItem(`${prefix}_${key}`) || '';
  if (key === ConfigKey.speed || key === ConfigKey.pitch) {
    const n = Number(value);
    return Number.isNaN(n) || value === '' ? '1' : String(n);
  }
  return value;
};

export function Options({ onChange }: Props) {
  const [locale, setLocale] = useState(
    getStorage(ConfigKey.locale) || 'Chinese (Mandarin, Simplified)'
  );
  const [voice, setVoice] = useState(getStorage(ConfigKey.voice));
  const [style, setStyle] = useState(getStorage(ConfigKey.style));
  const [rate, setRate] = useState(Number(getStorage(ConfigKey.speed)));
  const [pitch, setPitch] = useState(Number(getStorage(ConfigKey.pitch)));
  const voices = useMemo(() => getVoicesByLocale(locale), [locale]);
  const styles = useMemo(() => getStyles(voice), [voice]);

  useEffect(() => {
    if (voices.length > 0 && !voices.find((item) => item.key === voice)) {
      setVoice(voices[0]?.key);
    }
  }, [voice, voices]);

  useEffect(() => {
    if (styles.length > 0 && !styles.find((item) => item.key === style)) {
      setStyle(styles[0]?.key);
    }
  }, [style, styles]);

  useEffect(() => {
    onChange({
      voice,
      style,
      rate: `${(rate - 1) * 100}%`,
      pitch: `${(pitch - 1) * 50}%`,
    });
  }, [onChange, pitch, rate, style, voice]);

  useEffect(() => {
    setStorage(ConfigKey.locale, locale);
  }, [locale]);
  useEffect(() => {
    setStorage(ConfigKey.voice, voice);
  }, [voice]);
  useEffect(() => {
    setStorage(ConfigKey.style, style);
  }, [style]);
  useEffect(() => {
    setStorage(ConfigKey.speed, String(rate));
  }, [rate]);
  useEffect(() => {
    setStorage(ConfigKey.pitch, String(pitch));
  }, [pitch]);

  return (
    <Stack tokens={{ childrenGap: 36 }}>
      <Stack horizontal tokens={{ childrenGap: 24 }} horizontalAlign="end">
        <Dropdown
          options={locales}
          label="Language"
          placeholder="Select a language"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          selectedKey={locale}
          onChange={(_, item) => {
            const key = (item?.key || '') as string;
            if (key !== locale) {
              setLocale(key);
            }
          }}
        />
        <Dropdown
          options={voices}
          label="Voice"
          placeholder="Select a voice"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          selectedKey={voice}
          disabled={voices.length === 0}
          onChange={(_, item) => {
            const key = (item?.key || '') as string;
            if (key !== voice) {
              setVoice(key);
            }
          }}
        />
        <Dropdown
          options={styles}
          label="Style"
          placeholder="Select a style"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          disabled={styles.length === 0}
          selectedKey={style}
          onChange={(_, item) => {
            if (item?.key !== style) {
              setStyle(item?.key as string);
            }
          }}
        />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 24 }} horizontalAlign="end">
        <Slider
          label="Speed"
          max={3}
          value={rate}
          step={0.1}
          styles={{ root: { width: '33%' } }}
          onChange={setRate}
        />
        <Slider
          label="Pitch"
          max={2}
          value={pitch}
          step={0.1}
          styles={{ root: { width: '33%' } }}
          onChange={setPitch}
        />
        <Toggle
          label="Use SSML"
          onText="On"
          offText="Off"
          disabled
          styles={{ root: { width: '33%', visibility: 'hidden' } }}
        />
      </Stack>
    </Stack>
  );
}
