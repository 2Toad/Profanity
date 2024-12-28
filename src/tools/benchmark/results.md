# Benchmark Results ⏱️

## Test Environment

- **OS**: Windows 11 - WSL2 (Ubuntu 22.04.4 LTS)
- **CPU**: AMD Ryzen 9 5900HX 3.30 GHz (Benchmark constrained to 1 CPU core)
- **RAM**: 64 GB (Benchmark constrained to 512 MB)

### Benchmarks

#### v3.1.1
```
benchmark-1  | Using test data: v1
benchmark-1  | exists() - small clean text x 2,559,368 ops/sec ±2.95% (92 runs sampled)
benchmark-1  | exists() - small profane text x 1,941,051 ops/sec ±5.64% (79 runs sampled)
benchmark-1  | exists() - large clean text x 44,904 ops/sec ±5.60% (90 runs sampled)
benchmark-1  | exists() - large profane text x 816,615 ops/sec ±0.74% (96 runs sampled)
benchmark-1  | exists() - partial match, small profane text x 1,853,445 ops/sec ±28.20% (92 runs sampled)
benchmark-1  | censor() - Word, small profane text x 1,559,873 ops/sec ±2.07% (94 runs sampled)
benchmark-1  | censor() - FirstChar, small profane text x 1,548,998 ops/sec ±6.01% (96 runs sampled)
benchmark-1  | censor() - FirstVowel, small profane text x 1,093,426 ops/sec ±5.54% (89 runs sampled)
benchmark-1  | censor() - AllVowels, small profane text x 1,098,984 ops/sec ±0.64% (91 runs sampled)
benchmark-1  | censor() - Word, large profane text x 1,633 ops/sec ±6.12% (91 runs sampled)
benchmark-1  | censor() - partial match, Word, small profane text x 1,334,764 ops/sec ±5.43% (91 runs sampled)
benchmark-1  | Fastest: exists() - small clean text
```

#### v3.0.1
```
benchmark-1  | Using test data: v1
benchmark-1  | exists() - small clean text x 2,357,978 ops/sec ±3.50% (86 runs sampled)
benchmark-1  | exists() - small profane text x 1,705,114 ops/sec ±6.80% (77 runs sampled)
benchmark-1  | exists() - large clean text x 47,741 ops/sec ±1.74% (94 runs sampled)
benchmark-1  | exists() - large profane text x 817,113 ops/sec ±0.64% (94 runs sampled)
benchmark-1  | exists() - partial match, small profane text x 2,144,550 ops/sec ±5.92% (94 runs sampled)
benchmark-1  | censor() - Word, small profane text x 1,506,507 ops/sec ±6.02% (91 runs sampled)
benchmark-1  | censor() - FirstChar, small profane text x 1,507,623 ops/sec ±5.90% (92 runs sampled)
benchmark-1  | censor() - FirstVowel, small profane text x 1,105,023 ops/sec ±0.79% (88 runs sampled)
benchmark-1  | censor() - AllVowels, small profane text x 1,054,991 ops/sec ±5.46% (89 runs sampled)
benchmark-1  | censor() - Word, large profane text x 1,659 ops/sec ±5.81% (89 runs sampled)
benchmark-1  | censor() - partial match, Word, small profane text x 1,503,000 ops/sec ±0.55% (94 runs sampled)
benchmark-1  | Fastest: exists() - small clean text
```

#### v3.0.0
```
Using test data: v1
exists() - small clean text x 2,263,763 ops/sec ±3.96% (83 runs sampled)
exists() - small profane text x 1,831,670 ops/sec ±3.09% (86 runs sampled)
exists() - large clean text x 38,185 ops/sec ±2.82% (84 runs sampled)
exists() - large profane text x 686,951 ops/sec ±2.11% (87 runs sampled)
exists() - partial match, small profane text x 1,624,503 ops/sec ±8.02% (78 runs sampled)
censor() - Word, small profane text x 915,620 ops/sec ±6.16% (83 runs sampled)
censor() - FirstChar, small profane text x 1,275,945 ops/sec ±2.68% (77 runs sampled)
censor() - FirstVowel, small profane text x 902,065 ops/sec ±3.43% (81 runs sampled)
censor() - AllVowels, small profane text x 942,445 ops/sec ±2.94% (84 runs sampled)
censor() - Word, large profane text x 5,578 ops/sec ±2.17% (86 runs sampled)
censor() - partial match, Word, small profane text x 869,941 ops/sec ±7.91% (82 runs sampled)
Fastest: exists() - small clean text
```

#### v2.4.0
```
Using test data: v1
exists() - small clean text x 3,838,466 ops/sec ±3.34% (81 runs sampled)
exists() - small profane text x 2,557,317 ops/sec ±7.47% (74 runs sampled)
exists() - large clean text x 41,031 ops/sec ±2.82% (83 runs sampled)
exists() - large profane text x 799,283 ops/sec ±2.16% (83 runs sampled)
exists() - partial match, small profane text x 3,013,455 ops/sec ±5.68% (88 runs sampled)
censor() - Word, small profane text x 1,328,481 ops/sec ±2.17% (86 runs sampled)
censor() - FirstChar, small profane text x 2,197,796 ops/sec ±5.86% (84 runs sampled)
censor() - FirstVowel, small profane text x 1,184,065 ops/sec ±4.31% (75 runs sampled)
censor() - AllVowels, small profane text x 1,105,599 ops/sec ±7.69% (77 runs sampled)
censor() - Word, large profane text x 5,594 ops/sec ±6.02% (85 runs sampled)
censor() - partial match, Word, small profane text x 1,031,901 ops/sec ±2.86% (81 runs sampled)
Fastest: exists() - small clean text
```
