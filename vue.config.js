module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: 'http://157.190.53.14:9090',
        changeOrigin: true,
        replace: 'api',
        pathRewrite: {
          '^/api/api': '/api'
        },
      }
    }
  }
}