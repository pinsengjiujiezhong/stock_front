module.exports = {
  assetsDir: 'static',
  devServer: {
    // 端口号
    port: 8052,
    host: '127.0.0.1',
    proxy: {
      '/': {
        target: 'http://127.0.0.1:8000/',
        secure: false,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
        logLevel: 'debug'
      }
    }
  }
}
