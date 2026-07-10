import { createServer } from './node_modules/vite/dist/node/index.js';

const server = await createServer({
  configFile: './vite.config.ts',
  server: { port: 5173, host: '0.0.0.0' }
});
await server.listen();
server.printUrls();
console.log('DEV SERVER READY');
