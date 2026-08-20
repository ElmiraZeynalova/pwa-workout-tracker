import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import {connectDB, disconnectDB} from './config/db'

connectDB()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection: ", err)
    server.close(async() => {
        await disconnectDB()
        process.exit(1)
    })
})

process.on("uncaughtException", async(err) => {
    console.log("Uncaught Exeption: ", err)
    await disconnectDB()
    process.exit(1)

})

process.on("SIGTERM", (err) => {
    console.log("SIGTERM received, shutting down gracefully: ", err)
    server.close(async() => {
        await disconnectDB()
        process.exit(0)
    })
})