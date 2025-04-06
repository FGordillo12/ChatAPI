import express from 'express'
import logger from 'morgan'
import {Server} from 'socket.io'
import {createServer} from 'node:http'

const PORT = process.env.PORT ?? 3000

//CREACION DEL SERVIDOR
const app = express()
const server = createServer(app)
const io=new Server(server)

//MOSTRAR EN CONSOLA LAS PETICIONES
app.use (logger('dev'))

//SERVIR ARCHIVOS ESTATICOS 
app.use(express.static('public'))

//ESTABLECER CONEXION CON WEBSOCKET
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado')

    socket.on('disconnect', ()=>{
        console.log('Un usuario se ha desconectado')
    })

    socket.on('chat message', (msg)=> {
        console.log('mensaje: ' +msg)
    })
})


server.listen (PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
                    