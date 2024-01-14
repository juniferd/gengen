import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lSystem: resolve(__dirname, 'lSystem/index.html'),
        veraMolnar: resolve(__dirname, 'veraMolnar/index.html'),
        pixels: resolve(__dirname, 'pixels/index.html'),
        penrose: resolve(__dirname, 'penrose/index.html'),
        ascii: resolve(__dirname, 'ascii/index.html'),
        hexagons: resolve(__dirname, 'hexagons/index.html'),
        anniAlbers: resolve(__dirname, 'anniAlbers/index.html'),
      },
    },
  },
});
