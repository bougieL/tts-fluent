# tts-node

## Introduction

A node js package used to convert SSML(Speech Synthesis Markup Language) to voice via microsoft azure tts.

## Installation

```bash
npm i @bougiel/tts-node -S
```

## Usage

```ts
import fs from "fs";
import { textToSsml, ssmlToStream } from "@bougiel/tts-node";

const writeStream = fs.createWriteStream("./foo.mp3");

textToSsml("Hello world").then((stream) => {
  stream.pipe(wirteStream);
});

writeStream.on("finish", () => {
  console.log(`download success`);
  process.exit(0);
});

stream.on("error", (error) => {
  console.error("download failed", error);
});
```

## Documentation

- `textToSsml`

Convert text to ssml with configuration.

```ts
function textToSsml(
  text: string,
  options?: {
    voice?: string; // default "general"
    style?: string; // default "zh-CN-XiaoxiaoNeural"
    rate?: string; // default "0%"
    pitch?: string; // default "0%"
  }
): string;
```

- `ssmlToText`

Remove ssml markup.

```ts
function ssmlToText(ssml: string): string;
```

- `voices`

The collection of usable voices

```ts
type Voice = {
  Name: string;
  DisplayName: string;
  LocalName: string;
  ShortName: string;
  Gender: string;
  Locale: string;
  LocaleName: string;
  SampleRateHertz: string;
  VoiceType: string;
  Status: string;
  WordsPerMinute: string;
};
```

- `ssmlToStream`

Convert ssml to `Stream.Transform`

```ts
function ssmlToStream(ssml: string): Stream.Transform
```

## License

[MIT](./LICENSE)
