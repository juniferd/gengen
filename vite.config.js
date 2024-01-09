import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lSystem: resolve(__dirname, 'lSystem/index.html'),
        veraMolnar: resolve(__dirname, 'veraMolnar/index.html'),
      },
    },
  },
});
