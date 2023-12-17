import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [vue(),
    AutoImport({
        resolvers: [ElementPlusResolver()],
    }),
    Components({
        resolvers: [ElementPlusResolver()],
    })
    ],
    resolve: {        // 配置
        alias: {
            "@": path.resolve(__dirname, "src"),
        }
    },
    server: {
        host: 'localhost',
        open: true,
        port: 8080,
        hmr: true,
        proxy: {
        //     '/api': {
        //       target: 'http://localhost:3000',
        //       changeOrigin: true,
        //       rewrite: (path) => path.replace(/^\/api/, ''),
        //     }
        }
    },
    build: {
        outDir: 'dist',// 输出目录
        assetsDir: 'static',// 在输出时生成static
        rollupOptions: {
            output: {// 配置根据文件类型分开打包文件
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: "static/js/[name]-[hash].js",
                assetFileNames: "static/[ext]/name-[hash].[ext]"
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                // 生产环境时移除console
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log']
            },
        }
    }
})














// const config = {
//     plugins: [vue()],
//     base: '/',// 在生产中服务时的基本公共路径。@default '/'
//     alias: {
//         '@/': pathResolve('./src'),
//     },
//     outDir: 'vite-init',// 构建输出将放在其中。会在构建之前删除旧目录。@default 'dist'
//     minify: 'esbuild',// 构建时的压缩方式
//     hostname: 'localhost',// 本地启动的服务地址
//     port: '8080',// 服务端口号
//     open: true,// 启动服务时是否在浏览器打开
//     https: false,// 是否开启https
//     ssr: false,// 是否服务端渲染
//     // css: { postcss: './postcss.config.ts' },
//     optimizeDeps: {// 引入第三方的配置
//         include: ['axios']
//     },
//     // proxy: {//代理配置
//     //   '/api': {
//     //     target: 'http://xx.xx.xx.xx:xxxx',
//     //     changeOrigin: true,
//     //     ws: true,
//     //     rewrite: (path: string) => { path.replace(/^\/api/, '') }
//     //   }
//     // }
// }
// module.exports = config;