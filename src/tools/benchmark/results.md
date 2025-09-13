# Benchmark Results ⏱️

## Test Environment

- **OS**: macOS Sequoia
- **CPU**: Apple M4 Max (Benchmark constrained to 1 CPU core)
- **RAM**: 36 GB (Benchmark constrained to 512 MB)

### Benchmarks

#### v3.2.0
```
benchmark-1  | Using test data: v1
benchmark-1  | exists() - small profane text x 4,919,588 ops/sec ±1.31% (97 runs sampled)
benchmark-1  | exists() - small profane text (unicode on) x 1,741,222 ops/sec ±1.06% (97 runs sampled)
benchmark-1  | exists() - large clean text x 76,568 ops/sec ±1.25% (93 runs sampled)
benchmark-1  | exists() - large clean text (unicode on) x 14,514 ops/sec ±2.70% (93 runs sampled)
benchmark-1  | censor() - Word, small profane text x 3,076,329 ops/sec ±0.47% (95 runs sampled)
benchmark-1  | censor() - Word, small profane text (unicode on) x 1,244,954 ops/sec ±2.64% (95 runs sampled)
benchmark-1  | censor() - Word, large profane text x 2,359 ops/sec ±3.09% (98 runs sampled)
benchmark-1  | censor() - Word, large profane text (unicode on) x 2,208 ops/sec ±0.60% (98 runs sampled)
benchmark-1  | exists() - small clean text x 5,237,609 ops/sec ±0.56% (98 runs sampled)
benchmark-1  | exists() - large clean text x 66,847 ops/sec ±2.55% (87 runs sampled)
benchmark-1  | exists() - large profane text x 1,306,546 ops/sec ±2.49% (96 runs sampled)
benchmark-1  | exists() - partial match, small profane text x 4,337,740 ops/sec ±1.95% (97 runs sampled)
benchmark-1  | censor() - Word, small profane text x 2,941,414 ops/sec ±1.23% (98 runs sampled)
benchmark-1  | censor() - FirstChar, small profane text x 2,926,360 ops/sec ±2.21% (96 runs sampled)
benchmark-1  | censor() - FirstVowel, small profane text x 2,275,768 ops/sec ±2.97% (94 runs sampled)
benchmark-1  | censor() - AllVowels, small profane text x 2,176,117 ops/sec ±2.73% (90 runs sampled)
benchmark-1  | censor() - Word, large profane text x 2,345 ops/sec ±1.02% (97 runs sampled)
benchmark-1  | censor() - partial match, Word, small profane text x 2,630,832 ops/sec ±2.23% (95 runs sampled)
benchmark-1  | Fastest: exists() - small clean text
```

#### v3.1.1
```
benchmark-1  | Using test data: v1
benchmark-1  | exists() - small clean text x 5,260,719 ops/sec ±0.49% (94 runs sampled)
benchmark-1  | exists() - small profane text x 4,794,042 ops/sec ±0.64% (97 runs sampled)
benchmark-1  | exists() - large clean text x 70,614 ops/sec ±0.22% (98 runs sampled)
benchmark-1  | exists() - large profane text x 1,272,295 ops/sec ±3.32% (93 runs sampled)
benchmark-1  | exists() - partial match, small profane text x 4,408,923 ops/sec ±2.96% (99 runs sampled)
benchmark-1  | censor() - Word, small profane text x 2,911,216 ops/sec ±3.69% (97 runs sampled)
benchmark-1  | censor() - FirstChar, small profane text x 3,024,875 ops/sec ±0.30% (94 runs sampled)
benchmark-1  | censor() - FirstVowel, small profane text x 2,235,900 ops/sec ±2.53% (97 runs sampled)
benchmark-1  | censor() - AllVowels, small profane text x 2,205,688 ops/sec ±2.80% (95 runs sampled)
benchmark-1  | censor() - Word, large profane text x 2,458 ops/sec ±0.37% (99 runs sampled)
benchmark-1  | censor() - partial match, Word, small profane text x 2,716,684 ops/sec ±2.88% (97 runs sampled)
benchmark-1  | Fastest: exists() - small clean text
```

> NOTE: previous benchmarks performed in deprecated Test Environments can be viewed in Git history