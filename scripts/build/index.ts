import { type BuildConfig, build } from 'bun';

const config: BuildConfig = {
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
};

await build(config);
