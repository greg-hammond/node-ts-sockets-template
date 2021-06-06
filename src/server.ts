import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server, Socket } from 'socket.io'

const app = express()
const PORT = 53714
app.use(cors())

const server = http.createServer(app)

const options = {
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:5000'
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
}

const io = new Server(server, options)

io.on("connection", (socket: Socket) => {
    const sid = socket.id;
    console.log(`server: CONN:: ${sid}`)
    socket.on("disconnect", reason => {
        console.log(`server: DISC:: ${sid} - ${reason}`)
    })

    socket.emit("test1", `connected!  socket id = ${socket.id}`)
})

server.listen(PORT, () => console.log(`started server on ${PORT}`))
