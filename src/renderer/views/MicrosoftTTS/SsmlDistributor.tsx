import { memo, useEffect, useMemo } from 'react';
import list from '@bougiel/tts-node/lib/ssml/list';
import outputFormats from '@bougiel/tts-node/lib/ssml/outputFormats';

import { Grid, Input, NativeSelect, Slider } from 'renderer/components';
import { useFn } from 'renderer/hooks';

const locales = list
  .map((item) => {
    return {
      value: item.LocaleName,
      label: item.LocaleName,
    };
  })
  .reduce<Array<{ value: string; label: string }>>((acc, cur) => {
    return acc.find((item) => item.value === cur.value) ? acc : acc.concat(cur);
  }, [])
  .sort((a, b) => (a.label > b.label ? 1 : -1));

function getVoicesByLocale(locale: string) {
  return list
    .filter((item) => item.LocaleName === locale)
    .map((item) => {
      return {
        value: item.ShortName,
        label: `${item.LocalName} - ${item.DisplayName}`,
      };
    });
}

function getStyles(name: string) {
  return [{ value: 'genreal', label: 'General' }].concat(
    (list.find((item) => item.ShortName === name)?.StyleList || []).map(
      (item) => {
        return {
          value: item,
          label: item.replace(/^(\w)/, ($1) => $1.toUpperCase()),
        };
      }
    )
  );
}

const outputFormatsList = outputFormats.map((item) => ({
  value: item,
  label: item,
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

function C({ value, onChange }: Props) {
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
    if (voices.length > 0 && !voices.find((item) => item.value === voice)) {
      handleChange({
        ...value,
        voice: voices[0].value,
      });
    }
  }, [handleChange, value, voice, voices]);

  useEffect(() => {
    if (styles.length > 0 && !styles.find((item) => item.value === style)) {
      handleChange({
        ...value,
        style: styles[0].value,
      });
    }
  }, [handleChange, style, styles, value]);

  return (
    <Grid>
      <Grid.Col span={4}>
        <NativeSelect
          data={locales}
          label='Language'
          placeholder='Select a language'
          value={locale}
          onChange={(event) => {
            handleChange({
              ...value,
              locale: event.target.value,
            });
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NativeSelect
          data={voices}
          label='Voice'
          placeholder='Select a voice'
          value={voice}
          disabled={voices.length === 0}
          onChange={(event) => {
            handleChange({
              ...value,
              voice: event.target.value,
            });
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NativeSelect
          data={styles}
          label='Style'
          placeholder='Select a style'
          disabled={styles.length === 0}
          value={style}
          onChange={(event) => {
            handleChange({ ...value, style: event.target.value });
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label='Speed'>
          <Slider
            label='Speed'
            max={3}
            value={rate2n(rate)}
            step={0.1}
            onChange={(rate) => {
              handleChange({
                ...value,
                rate: `${(rate - 1) * 100}%`,
              });
            }}
          />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label='Pitch'>
          <Slider
            label='Pitch'
            max={2}
            value={pitch2n(pitch)}
            step={0.1}
            onChange={(pitch) => {
              handleChange({
                ...value,
                pitch: `${(pitch - 1) * 50}%`,
              });
            }}
          />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <NativeSelect
          data={outputFormatsList}
          label='Output format'
          placeholder='Select output format'
          value={outputFormat}
          onChange={(event) => {
            handleChange({
              ...value,
              outputFormat: event.target.value,
            });
          }}
        />
      </Grid.Col>
    </Grid>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isEqual<T extends {}>(a: T, b: T) {
  return Object.keys(a).every((key) => {
    return a[key as keyof T] === b[key as keyof T];
  });
}

export const SsmlDistributor = memo(C, (prevProps, nextProps) => {
  return isEqual(prevProps.value, nextProps.value);
});
