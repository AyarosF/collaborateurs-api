console.clear()
console.log(`******************* SERVER LOADED *******************`)

import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import route from './routes/routes.js'
