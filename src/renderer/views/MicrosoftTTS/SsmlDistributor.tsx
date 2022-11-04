import { useMemo } from 'react';
import list from '@bougiel/tts-node/lib/ssml/list';
import outputFormats from '@bougiel/tts-node/lib/ssml/outputFormats';
import { Grid, Input, NativeSelect, Slider } from '@mantine/core';

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

export function SsmlDistributor({ value, onChange }: Props) {
  const rate2n = (v: string) =>
    Math.round(Number.parseFloat(v) / 10 || 0) / 10 + 1;
  const pitch2n = (v: string) =>
    Math.round(Number.parseFloat(v) / 5 || 0) / 10 + 1;

  const { locale, voice, style, rate, pitch, outputFormat } = value;

  const voices = useMemo(() => getVoicesByLocale(locale), [locale]);
  const styles = useMemo(() => getStyles(voice), [voice]);

  const handleChange = useFn((newValue: SsmlConfig) => {
    onChange(newValue);
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
      ...value,
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
      ...value,
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
            handleChange({ ...value, style: event.target.value });
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label={`Speed ${rate}`}>
          <Slider
            label={rate}
            min={0}
            max={3}
            value={rate2n(rate)}
            step={0.1}
            onChange={(rate) => {
              handleChange({
                ...value,
                rate: `${Math.round((rate - 1) * 10) * 10}%`,
              });
            }}
          />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Input.Wrapper label={`Pitch ${pitch}`}>
          <Slider
            label={pitch}
            max={2}
            value={pitch2n(pitch)}
            step={0.1}
            onChange={(pitch) => {
              handleChange({
                ...value,
                pitch: `${Math.round((pitch - 1) * 10) * 5}%`,
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
