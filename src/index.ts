import app from './app'
import http from 'http'
import { config } from '../config'
import { BlefServer } from './BlefServer'
const port = config.BACKENDSERVERPORT || 5678
const hostname = config.HOSTNAME

const server = http.createServer(app).listen(port, hostname, 0, () => {
    console.log(`Server is up at port ${hostname}:${port}`)
    console.log(`with config:
        mode: ${config.mode}
        frontend address: ${config.mode === 'production' ? config.BACKEND_SERVER_ADDRESS : config.FRONTEND_SERVER_ADDRESS}
        backend adress: ${config.BACKEND_SERVER_ADDRESS}
        adress: ${config.ADDRES}
        hostname: ${config.HOSTNAME} `)
})

app.set('trust proxy', 1) // Trust first proxy.

let blefServer = new BlefServer(server)
