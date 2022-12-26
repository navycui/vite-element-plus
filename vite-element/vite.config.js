import { defineConfig,loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";


export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    // devServer: {
    //   proxy: 'http://localhost:3000'
    // },
    optimizeDeps: {
        include: ['']
    },
    resolve: { 
      alias: { 
        // '@': path.resolve(__dirname, './src') // 구버전 ....
        '@': fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV
    },
    //build 시에 모든 console.log를 제거
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    server: {
      open:'/',
      host:'localhost',
      https:false,
      port:'3000',
      proxy: {
        // string shorthand
        '/foo': 'http://localhost:4567',
        '/api/*': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
        // with RegEx
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, '')
        },
        // Using the proxy instance
        '/apis': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy will be an instance of 'http-proxy'
          }
        },
        // Proxying websockets or socket.io
        '/socket.io': {
          target: 'ws://localhost:8080',
          ws: true
        }
      }
    }
  }
})