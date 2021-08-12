import vue from '@vitejs/plugin-vue'
import path from "path";
const pathResolve = (pathStr: string) => {
    return path.resolve(__dirname, pathStr);
}

const config = {
    plugins: [vue()],
    base: '/',//在生产中服务时的基本公共路径。@default '/'
    alias: {
        '/@/': pathResolve('./src'),
    },
    outDir: 'vite-init',//构建输出将放在其中。会在构建之前删除旧目录。@default 'dist'
    minify: 'esbuild',//构建时的压缩方式
    hostname: 'localhost',//本地启动的服务地址
    port: '8080',//服务端口号
    open: true,//启动服务时是否在浏览器打开
    https: false,//是否开启https
    ssr: false,//是否服务端渲染
    // css: { postcss: './postcss.config.ts' },
    optimizeDeps: {// 引入第三方的配置
        include: ['axios']
    },
    // proxy: {//代理配置
    //   '/api': {
    //     target: 'http://xx.xx.xx.xx:xxxx',
    //     changeOrigin: true,
    //     ws: true,
    //     rewrite: (path: string) => { path.replace(/^\/api/, '') }
    //   }
    // }
}
module.exports = config;