import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { dependencies } from './package.json'
import path from 'path'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [
    react(),
    // splitVendorChunkPlugin(),
    tsconfigPaths(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        // /\.vue$/,
        // /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: ['ahooks', 'react-router-dom', 'react'],
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'jsx'
        })
      ]
    }),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
      iconCustomizer(collection, icon, props) {
        props.width = '1em'
        props.height = '1em'
      }
    })
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  },
  base: '/playground/',
  build: {
    rollupOptions: {
      output: {
        // chunkFileNames: (chunkInfo) => {
        //   if (chunkInfo.isDynamicEntry) {
        //     // /Users/zhw/zhw-workspace/web-project-2/dam-gpt-playground/src/pages/PlaygroundApp/index.tsx
        //     const filenameReg = /\/src\/(?:pages|component)\/(.*)\//
        //     const facadeModuleId = chunkInfo.facadeModuleId
        //     if (facadeModuleId) {
        //       const filename = facadeModuleId.match(filenameReg)?.[1]
        //       if (filename) return `assets/${filename}-[hash].js`
        //     }
        //     return `assets/[name]-[hash].js`
        //   }
        // },
        manualChunks: {
          lodash: ['lodash'],
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd']
        }
      }
    }
  },
  resolve: {
    alias: {
      // Fix: Missing "./lib/helpers/buildURL" specifier in "axios" package
      // 不知道为啥报错
      'axios/lib': path.resolve(__dirname, './node_modules/axios/lib')
    }
  },
  define: {
    // axios-extension
    'process.env.LOGGER_LEVEL': JSON.stringify('info')
  },
  alias: {
    alias: {
      '@': '/src'
    }
  }
})

function renderChunks(deps: Record<string, string>) {
  const chunks = {}
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}
