console.clear()
console.log(`******************* SERVER LOADED *******************`)

import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import cors from 'cors'

import route from './routes/routes.js'
import logger from './middlewares/logger.js' 

// ==========
// Database initialization
// ==========

mongoose
  .set('strictQuery', true)
  .connect('mongodb://127.0.0.1:27017/collaborators', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(init)

// ==========
// App initialization
// ==========

async function init() {
  dotenv.config()
  const { APP_HOSTNAME, APP_PORT, NODE_ENV } = process.env
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const app = express();
  // ==========
  // App middlewares
  // ==========

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(logger)

  // ==========
  // App routers
  // ==========
  app.options('*', cors())
  app.use(cors())
  app.use('/', route)


  // ==========
  // App start
  // ==========

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`)
  })
  
}