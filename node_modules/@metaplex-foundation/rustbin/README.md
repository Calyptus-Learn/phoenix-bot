# rustbin [![Build Lint and Test Rustbin](https://github.com/metaplex-foundation/rustbin/actions/workflows/rustbin.yml/badge.svg)](https://github.com/metaplex-foundation/rustbin/actions/workflows/rustbin.yml)

Synchronizes a Rust binary version with the related Rust crate.

## Anchor Example

### Prepare Config

```js
const path = require('path');
const rootDir = path.join(__dirname, 'cargo');
const cargoToml = path.join(__dirname, '..', '..', 'program', 'Cargo.toml');

const config = {
  rootDir,
  binaryName: 'anchor',
  binaryCrateName: 'anchor-cli',
  libName: 'anchor-lang',
  dryRun: false,
  cargoToml,
};
```

### Checking Versions

```js
const { rustbinCheck } = require('@metaplex-foundation/rustbin');
const { satisfies, libVersion, binVersion } = await rustbinCheck({
console.log(`${binVersion} %s ${libVersion}`, satisfies ? 'satisfies' : 'does not satisfy');
```

### Check and Install If Needed

```js
const { rustbinMatch, confirmAutoMessageConsole } = require('@metaplex-foundation/rustbin');
const { cmd, fullPathToBinary } = await rustbinMatch(config, confirmAutoMessageConsole);
console.log(`${fullPathToBinary} installed via ${cmd}`);
```

## API

Please consult the full API [here](https://metaplex-foundation.github.io/rustbin/docs/).

## LICENSE

Apache-2.0
