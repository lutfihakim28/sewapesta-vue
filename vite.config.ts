import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'violet',
          neutral: 'neutral'
        },
        input: {
          defaultVariants: {
            size: 'lg',
          }
        }
      },
      autoImport: {
        dts: true,
        dirs: [
          './src/**'
        ],
        imports: [
          // presets
          'vue',
          'vue-router',
        ]
      },
      components: {
        dts: true
      }
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
