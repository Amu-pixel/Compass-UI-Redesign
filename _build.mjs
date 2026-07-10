import { build } from './node_modules/vite/dist/node/index.js';
build().then(() => {
  console.log('VITE BUILD OK');
}).catch((e) => {
  console.error('BUILD FAILED:', e.message);
  process.exit(1);
});
