# Profanity

[![GitHub version](https://badge.fury.io/gh/2Toad%2FProfanity.svg)](https://badge.fury.io/gh/2Toad%2FProfanity)
[![Downloads](https://img.shields.io/npm/dm/@2toad/profanity.svg)](https://www.npmjs.com/package/@2toad/profanity)
[![Build Status](https://travis-ci.org/2Toad/Profanity.svg?branch=master)](https://travis-ci.org/2Toad/Profanity)

A JavaScript profanity filter

## Getting Started

Install package

```
npm i @2toad/profanity
```

## Usage

```
import { profanity } from '@2toad/profanity';

profanity.exists('I like big butts and I cannot lie');
// true

profanity.exists('I like big buttocks and I cannot lie');
// false

profanity.censor('I like big butts (and ar5e) and I cannot lie');
// I like big @#$%&! (and @#$%&!) and I cannot lie
```

## Options
There are several configurable options you can set when you create an instance of the Profanity class:

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
profanity.exists('Two profane words joined: buttsAr5e');
// false
```

Setting this to `false`, results in:
```
profanity.exists('Two profane words joined: buttsAr5e');
// true
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

Remove words:
```
profanity.removeWords(['butt', 'ar5e']);
```

Add words:
```
profanity.addWords(['aardvark', 'zebra']);
```
