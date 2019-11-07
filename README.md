# Profanity

[![GitHub version](https://badge.fury.io/gh/2Toad%2FProfanity.svg)](https://badge.fury.io/gh/2Toad%2FProfanity)
[![Downloads](https://img.shields.io/npm/dm/@2toad/profanity.svg)](https://www.npmjs.com/package/@2toad/profanity)
[![Build Status](https://travis-ci.org/2Toad/Profanity.svg?branch=master)](https://travis-ci.org/2Toad/Profanity)

A JavaScript profanity filter (with TypeScript support)

## Getting Started

Install package

```
npm i @2toad/profanity
```

## Usage

```
import { profanity } from '@2toad/profanity';
// or
var profanity = require('@2toad/profanity').profanity;


profanity.exists('I like big butts and I cannot lie');
// true

profanity.exists('I like big glutes and I cannot lie');
// false

profanity.censor('I like big butts (aka arses) and I cannot lie');
// I like big @#$%&! (aka @#$%&!) and I cannot lie
```

## Options
Create an instance of the Profanity class to change the default options:

```
import { Profanity, ProfanityOptions } from '@2toad/profanity';

const options = new ProfanityOptions();
options.wholeWord = false;
options.grawlix = '*****';

const profanity = new Profanity(options);
```

### wholeWord

By default this is set to `true`, so profanity only matches on whole words:
```
profanity.exists('Arsenic is poisonous but not profane');
// false
```

Setting this to `false`, results in partial word matches:
```
profanity.exists('Arsenic is poisonous but not profane');
// true (matched on arse)
```

### grawlix

By default this is set to `@#$%&!`:
```
profanity.censor('I like big butts and I cannot lie');
// I like big @#$%&! and I cannot lie
```

Setting this to `****`, results in:
```
profanity.censor('I like big butts and I cannot lie');
// I like big **** and I cannot lie
```

## Customize the word list

Add words:
```
profanity.addWords(['aardvark', 'zebra']);
```

Remove words:
```
profanity.removeWords(['butt', 'arse']);
```

## Whitelist
The whitelist allows you to specify words that are always ignored by the profanity filter.

>This can be useful if you want to turn partial word matching on (`wholeWord = true`), so combined words are caught (e.g., arselicker), while specific words you add to the whitelist are ignored (e.g., arsenic).

Add words to the whitelist:
```
profanity.whitelist.addWords(['arsenic', 'buttress']);
```

Remove words from the whitelist:
```
profanity.whitelist.removeWords(['arsenic', 'buttress']);
```
