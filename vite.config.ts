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
        },
        card: {
          defaultVariants: {
            variant: 'subtle',
          }
        },
        select: {
          slots: {
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }
        },
        modal: {
          slots: {
            overlay: 'z-10',
            content: 'z-20'
          }
        }
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
