import { Dropdown, Slider, Stack } from 'renderer/components';
import list from '@bougiel/tts-node/lib/ssml/list';
import outputFormats from '@bougiel/tts-node/lib/ssml/outputFormats';
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

const outputFormatsList = outputFormats.map((item) => ({
  key: item,
  text: item,
}));

export interface SsmlConfig {
  locale: string;
  voice: string;
  style: string;
  rate: string;
  pitch: string;
  outputFormat: string;
}

interface Props {
  value: SsmlConfig;
  onChange: (value: SsmlConfig) => void;
}

export function Options({ value, onChange }: Props) {
  const rate2n = (v: string) => Number.parseInt(v, 10) / 100 || 0 + 1;
  const pitch2n = (v: string) => Number.parseInt(v, 10) / 50 || 0 + 1;

  const [locale, setLocale] = useState(value.locale);
  const [voice, setVoice] = useState(value.voice);
  const [style, setStyle] = useState(value.style);
  const [rate, setRate] = useState(rate2n(value.rate));
  const [pitch, setPitch] = useState(pitch2n(value.pitch));
  const [outputFormat, setOutputFormat] = useState(value.outputFormat);
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
      locale,
      voice,
      style,
      rate: `${(rate - 1) * 100}%`,
      pitch: `${(pitch - 1) * 50}%`,
      outputFormat,
    });
  }, [locale, onChange, outputFormat, pitch, rate, style, voice]);

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
        <Dropdown
          options={outputFormatsList}
          label="Output format"
          placeholder="Select output format"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          // disabled={styles.length === 0}
          selectedKey={outputFormat}
          onChange={(_, item) => {
            if (item?.key !== outputFormat) {
              setOutputFormat(item?.key as string);
            }
          }}
        />
      </Stack>
    </Stack>
  );
}
