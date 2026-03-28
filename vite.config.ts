import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { crx } from '@crxjs/vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    solidPlugin(),
    crx({ manifest }),
  ],
  build: {
    target: 'esnext',
  },
})
