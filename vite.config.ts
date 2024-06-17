import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    // 自动导入框架、路由库、状态管理库的API
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: [],
      dts: 'src/auto-imports.d.ts',
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, './src/assets/svg')],
      symbolId: 'icon-[name]',
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/style/variables.less";`,
      },
    },
  },
  build: {
    cssCodeSplit: false,
  },
})
