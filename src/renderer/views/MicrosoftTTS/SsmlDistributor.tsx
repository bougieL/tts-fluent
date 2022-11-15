import { useMemo, useRef } from 'react';
import { outputFormats, voices } from '@bougiel/tts-node';
import { Grid, Input, NativeSelect, Slider } from '@mantine/core';

import { useFn } from 'renderer/hooks';

const locales = voices
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
  return voices
    .filter((item) => item.LocaleName === locale)
    .sort((a, b) => (a.ShortName > b.ShortName ? 1 : -1))
    .map((item) => {
      return {
        value: item.ShortName,
        label: `${item.LocalName} - ${item.DisplayName}`,
      };
    });
}

function getStyles(name: string) {
  return [{ value: 'genreal', label: 'General' }].concat(
    (voices.find((item) => item.ShortName === name)?.StyleList || []).map(
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

export function SsmlDistributor({ value, onChange }: Props) {
  const rate2n = (v: string) =>
    Number((Number.parseInt(v, 10) / 100 + 1).toFixed(1));
  const pitch2n = (v: string) =>
    Number((Number.parseInt(v, 10) / 50 + 1).toFixed(1));
  const n2rate = (n: number) => `${Math.round((n - 1) * 10) * 10}%`;
  const n2pitch = (n: number) => `${Math.round((n - 1) * 10) * 5}%`;

  const { locale, voice, style, rate, pitch, outputFormat } = value;

  const voices = useMemo(() => getVoicesByLocale(locale), [locale]);
  const styles = useMemo(() => getStyles(voice), [voice]);

  const valueRef = useRef(value);
  valueRef.current = value;

  const handleChange = useFn((newValue: Partial<SsmlConfig>) => {
    onChange({ ...valueRef.current, ...newValue });
  });

  const handleLocaleChange = useFn((v: string) => {
    const voices = getVoicesByLocale(v);
    let newVoice = voice;
    if (voices.length > 0 && !voices.find((item) => item.value === voice)) {
      newVoice = voices[0].value;
    }
    const styles = getStyles(newVoice);
    let newStyle = style;
    if (styles.length > 0 && !styles.find((item) => item.value === style)) {
      newStyle = styles[0].value;
    }
    handleChange({
      locale: v,
      voice: newVoice,
      style: newStyle,
    });
  });

  const handleVoiceChange = useFn((v: string) => {
    const styles = getStyles(v);
    let newStyle = style;
    if (styles.length > 0 && !styles.find((item) => item.value === style)) {
      newStyle = styles[0].value;
    }
    handleChange({
      voice: v,
      style: newStyle,
    });
  });

  return (
    <Grid>
      <Grid.Col span={4}>
        <NativeSelect
          data={locales}
          label='Language'
          placeholder='Select a language'
          value={locale}
          onChange={(event) => {
            handleLocaleChange(event.target.value);
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
            handleVoiceChange(event.target.value);
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
            handleChange({ style: event.target.value });
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label={`Speed ${rate2n(rate)}`}>
          <Slider
            label={rate}
            min={0}
            max={3}
            value={rate2n(rate)}
            step={0.1}
            onChange={(rate) => {
              handleChange({
                rate: n2rate(rate),
              });
            }}
          />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label={`Pitch ${pitch2n(pitch)}`}>
          <Slider
            label={pitch}
            min={0}
            max={2}
            value={pitch2n(pitch)}
            step={0.1}
            onChange={(pitch) => {
              handleChange({
                pitch: n2pitch(pitch),
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
              outputFormat: event.target.value,
            });
          }}
        />
      </Grid.Col>
    </Grid>
  );
}
