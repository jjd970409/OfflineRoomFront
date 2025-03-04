const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    open: true,
    proxy: {
      '/api': { // <-- 정확히 '/api' (슬래시, 소문자)
        target: 'http://localhost:8080', // Spring Boost 서버 주소
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // <-- /api 제거 (Spring Boot @RequestMapping("/api")와 세트)
        },
      },
    },
  },
  transpileDependencies: true,
})