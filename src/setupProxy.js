require('dotenv').config()
const { createProxyMiddleware } = require('http-proxy-middleware')

console.log(process.env.SERVER_URL)

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.SERVER_URL,
      changeOrigin: true,
    })
  )
}