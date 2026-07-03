import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB!)

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from './routes/auth.route'
const app = express()

app.listen(process.env.PORT, () => {
     console.log(`db connected and server is running on ${process.env.PORT} Port`)
})


app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use("/auth", AuthRouter)