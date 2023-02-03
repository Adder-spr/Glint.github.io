const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
        '/lw': {
            target: 'http://localhost:8081', //接口域名
            changeOrigin: true,             //是否跨域
            ws: true,                       //是否代理 websockets
            secure: true,                   //是否http接口
            pathRewrite: {                  //路径重置
                '^/lw': ''
            }
        },
        '/checkEmail': {
            target: 'http://127.0.0.1:8081', //接口域名
            changeOrigin: true,             //是否跨域
            ws: true,                       //是否代理 websockets
            secure: true,                   //是否http接口
            pathRewrite: {                  //路径重置
                '^/checkEmail': ''
            }
        },
        '/test': {
            target: 'https://api.nbhao.org/v1/email/verify',
            changeOrigin: true,
            https: true,
            pathRewrite: {
                '^/test': ''
            }
        }
    }
  },

};
