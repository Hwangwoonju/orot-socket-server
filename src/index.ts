import dotenv from 'dotenv'
import path from 'path'
import { Server, Socket } from "socket.io"
import Redis from "ioredis"
import { createServer } from "http"
import express from "express"

if(process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(process.env.PWD, '/.env.production') })
} else {
  dotenv.config({ path: path.join(process.env.PWD, '/.env.development') })
}

const REQUEST_SERVER_DOMAIN = process.env.REQUEST_SERVER_DOMAIN
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST

const app = express()
const port = 3001
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: [REQUEST_SERVER_DOMAIN]
  }
})
const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST
})

redis.subscribe("video-channel", (err, count) => {
  if (err) {
    // Just like other commands, subscribe() can fail for some reasons,
    // ex network issues.
    console.error("Failed to subscribe: %s", err.message)
  } else {
    // `count` represents the number of channels this client are currently subscribed to.
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    )
  }
})

redis.on("message", function (channel: string, message: string) {
  const jsonMessage = JSON.parse(message)

  io.emit(channel + ":" + jsonMessage.event, jsonMessage.data)
})

io.on("connection", function (socket: Socket) {
  console.log("Connected")

  socket.on("disconnect", function () {
    console.log("Disconnected")
  })
})

httpServer.listen(port, () => {
  console.log(`Socket listening at ${REQUEST_SERVER_DOMAIN}`)
})
