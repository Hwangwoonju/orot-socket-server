"use strict"

module.exports = {
  apps: [
    {
      name: "orot-socket-server",
      script: "./build/index.js",
      watch: true,
      env: {
        PORT: 3001,
        NODE_ENV: "development"
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    }
  ]
}
