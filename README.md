# Profanity

[![GitHub version](https://badge.fury.io/gh/2Toad%2FProfanity.svg)](https://github.com/2Toad/Profanity/releases)
[![Downloads](https://img.shields.io/npm/dm/@2toad/profanity.svg)](https://www.npmjs.com/package/@2toad/profanity)
[![Build status](https://github.com/2toad/profanity/actions/workflows/nodejs.yml/badge.svg)](https://github.com/2Toad/Profanity/actions/workflows/nodejs.yml)

A JavaScript profanity filter (with TypeScript support)

## Getting Started

Install package

```Shell
npm i @2toad/profanity
```

>if you're using Node 11.x or older you'll need to install [Profanity 1.x](https://github.com/2Toad/Profanity/releases) (e.g., `npm i @2toad/profanity@1.4.0`)

## Usage

```JavaScript
import { profanity } from '@2toad/profanity';
// or
var profanity = require('@2toad/profanity').profanity;


profanity.exists('I like big butts and I cannot lie');
// true

profanity.exists('I like big glutes and I cannot lie');
// false

profanity.censor('I like big butts (aka arses) and I cannot lie');
// I like big @#$%&! (aka @#$%&!) and I cannot lie

profanity.censor('I like big butts (aka arses) and I cannot lie', CensorType.FirstChar);
// I like big *utts (aka *rses) and I cannot lie
```

## Options
Create an instance of the Profanity class to change the default options:

```JavaScript
import { Profanity, ProfanityOptions } from '@2toad/profanity';

const options = new ProfanityOptions();
options.wholeWord = false;
options.grawlix = '*****';
options.grawlixChar = '$';

const profanity = new Profanity(options);
```

### wholeWord

By default this is set to `true`, so profanity only matches on whole words:
```JavaScript
profanity.exists('Arsenic is poisonous but not profane');
// false
```

Setting this to `false`, results in partial word matches:
```JavaScript
profanity.exists('Arsenic is poisonous but not profane');
// true (matched on arse)
```

### grawlix

By default this is set to `@#$%&!`:
```JavaScript
profanity.censor('I like big butts and I cannot lie');
// I like big @#$%&! and I cannot lie
```

Setting this to `****`, results in:
```JavaScript
profanity.censor('I like big butts and I cannot lie');
// I like big **** and I cannot lie
```

### grawlixChar

When specifying a `CensorType` other than `CensorType.Word`, this is the character used by the `censor` function.

By default this is set to `*`:
```JavaScript
profanity.censor('I like big butts and I cannot lie', CensorType.AllVowels);
// I like big b*tts and I cannot lie
```

Setting this to `$`, results in:
```JavaScript
profanity.censor('I like big butts and I cannot lie', CensorType.AllVowels);
// I like big b$tts and I cannot lie
```


## Customize the word list

Add words:
```JavaScript
profanity.addWords(['aardvark', 'zebra']);
```

Remove words:
```JavaScript
profanity.removeWords(['butt', 'arse']);
```

## Whitelist
The whitelist allows you to specify words that are always ignored by the profanity filter.

>This can be useful if you want to turn partial word matching on (`wholeWord = true`), so combined words are caught (e.g., arselicker), while specific words you add to the whitelist are ignored (e.g., arsenic).

Add words to the whitelist:
```JavaScript
profanity.whitelist.addWords(['arsenic', 'buttress']);
```

Remove words from the whitelist:
```JavaScript
profanity.whitelist.removeWords(['arsenic', 'buttress']);
```

## Contributing

So you want to contribute to the Profanikty project? Fantastic! Please read the [Contribute](https://github.com/2Toad/Profanity/blob/master/contribute.md) doc to get started.