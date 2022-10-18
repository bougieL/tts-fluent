import { memo, useEffect, useMemo, useState } from 'react';
import { Dropdown, Slider, Stack } from 'renderer/components';
import list from '@bougiel/tts-node/lib/ssml/list';
import outputFormats from '@bougiel/tts-node/lib/ssml/outputFormats';
import { useFn } from 'renderer/hooks';

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

function OptionsComponent({ value, onChange }: Props) {
  const rate2n = (v: string) => Number.parseInt(v, 10) / 100 || 0 + 1;
  const pitch2n = (v: string) => Number.parseInt(v, 10) / 50 || 0 + 1;

  const { locale, voice, style, rate, pitch, outputFormat } = value;

  const voices = useMemo(() => getVoicesByLocale(locale), [locale]);
  const styles = useMemo(() => getStyles(voice), [voice]);

  const handleChange = useFn((newValue: SsmlConfig) => {
    if (!isEqual(newValue, value)) {
      onChange(newValue);
    }
  });

  useEffect(() => {
    if (voices.length > 0 && !voices.find((item) => item.key === voice)) {
      handleChange({
        ...value,
        voice: voices[0].key,
      });
    }
  }, [handleChange, value, voice, voices]);

  useEffect(() => {
    if (styles.length > 0 && !styles.find((item) => item.key === style)) {
      handleChange({
        ...value,
        style: styles[0].key,
      });
    }
  }, [handleChange, style, styles, value]);

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Stack horizontal tokens={{ childrenGap: 24 }} horizontalAlign="end">
        <Dropdown
          options={locales}
          label="Language"
          placeholder="Select a language"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          selectedKey={locale}
          onChange={(_, item) => {
            handleChange({
              ...value,
              locale: item?.key as string,
            });
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
            handleChange({
              ...value,
              voice: item?.key as string,
            });
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
            handleChange({ ...value, style: item?.key as string });
          }}
        />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 24 }} horizontalAlign="end">
        <Slider
          label="Speed"
          max={3}
          value={rate2n(rate)}
          step={0.1}
          styles={{ root: { width: '33%' } }}
          onChange={(rate) => {
            handleChange({
              ...value,
              rate: `${(rate - 1) * 100}%`,
            });
          }}
        />
        <Slider
          label="Pitch"
          max={2}
          value={pitch2n(pitch)}
          step={0.1}
          styles={{ root: { width: '33%' } }}
          onChange={(pitch) => {
            handleChange({
              ...value,
              pitch: `${(pitch - 1) * 50}%`,
            });
          }}
        />
        <Dropdown
          options={outputFormatsList}
          label="Output format"
          placeholder="Select output format"
          styles={{ root: { width: '33%' }, callout: { height: 400 } }}
          // disabled={styles.length === 0}
          selectedKey={outputFormat}
          onChange={(_, item) => {
            handleChange({
              ...value,
              outputFormat: item?.key as string,
            });
          }}
        />
      </Stack>
    </Stack>
  );
}

function isEqual<T extends {}>(a: T, b: T) {
  return Object.keys(a).every((key) => {
    return a[key as keyof T] === b[key as keyof T];
  });
}

export const Options = memo(OptionsComponent, (prevProps, nextProps) => {
  return isEqual(prevProps.value, nextProps.value);
});
