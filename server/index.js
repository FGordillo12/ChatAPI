import express from 'express'
import logger from 'morgan'
import {Server} from 'socket.io'
import {createServer} from 'node:http'
import path from 'path'
import { fileURLToPath } from 'url'  

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io=new Server(server)



io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado')

    socket.on('disconnect', ()=>{
        console.log('Un usuario se ha desconectado')
    })
})

app.use (logger('dev'))

app.use('/Imagenes', express.static(path.join(__dirname, '../Imagenes')))



app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen (port, () => {
    console.log(`Server running on port http://localhost:${port}`)
})
                    