const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})
module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        client: {
            webSocketURL: 'ws://127.0.0.1:8080/ws',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/lw': {
                target: 'http://127.0.0.1:8081', //接口域名
                // changeOrigin: true,             //是否跨域
                secure: true,                   //是否http接口
                pathRewrite: {                  //路径重置
                    '^/lw': ''
                },
            },
            '/checkEmail': {
                target: 'http://127.0.0.1:8081', //接口域名
                // changeOrigin: true,             //是否跨域
                secure: true,                   //是否http接口
                pathRewrite: {                  //路径重置
                    '^/checkEmail': ''
                },
            },
        },
        historyApiFallback: true,
        allowedHosts: "all",
    },
};
