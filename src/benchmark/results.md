# Benchmark Results ⏱️

## Test Environment

- **OS**: Windows 11 - WSL2 (Ubuntu 22.04.4 LTS)
- **CPU**: AMD Ryzen 9 5900HX 3.30 GHz
- **RAM**: 64 GB

### Benchmarks

#### v2.4.0
```
Using test data: v1
exists() - small clean text x 7,384,356 ops/sec ±1.24% (95 runs sampled)
exists() - small profane text x 6,347,800 ops/sec ±1.25% (90 runs sampled)
exists() - large clean text x 49,978 ops/sec ±0.56% (93 runs sampled)
exists() - large profane text x 1,216,505 ops/sec ±2.03% (81 runs sampled)
exists() - partial match, small profane text x 5,319,125 ops/sec ±1.04% (93 runs sampled)
censor() - Word, small profane text x 1,899,374 ops/sec ±0.54% (95 runs sampled)
censor() - FirstChar, small profane text x 3,233,749 ops/sec ±1.40% (87 runs sampled)
censor() - FirstVowel, small profane text x 1,894,666 ops/sec ±0.92% (92 runs sampled)
censor() - AllVowels, small profane text x 1,697,305 ops/sec ±2.07% (92 runs sampled)
censor() - Word, large profane text x 9,563 ops/sec ±0.91% (87 runs sampled)
censor() - partial match, Word, small profane text x 1,597,856 ops/sec ±1.19% (92 runs sampled)
Fastest: exists() - small clean text
```
