module.exports = {
  reactStrictMode: true,
  env: {
    CURRENT_SERVER: process.env.CURRENT_SERVER,
    CURRENT_SERVER_PORT: process.env.CURRENT_SERVER_PORT,
    RES_SERVER: process.env.RES_SERVER,
    RES_SERVER_PORT: process.env.RES_SERVER_PORT
  },
  images: {
    domains: ['aspen.room-house.com','iberia.room-house.com']
  }
}
