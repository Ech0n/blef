// THIS IS SERVER CONFIG
// IF YOU NEED TO CONFIG CLIENT VISIT .env file
const default_back_port = 5678
const default_front_port = 5173
const default_hostname = 'localhost'

const back_port: number = Number(process.env.BLEF_BACKEND_PORT) || default_back_port
const front_port: number = Number(process.env.BLEF_FRONTEND_PORT) || default_front_port

const hostname = process.env.BLEF_HOSTNAME || default_hostname
const address = 'http://' + hostname

export const config = {
    mode: process.env.NODE_ENV || 'dev',
    BACKENDSERVERPORT: back_port,
    FRONTENDSERVERPORT: front_port,
    HOSTNAME: hostname,
    ADDRES: address,
    BACKEND_SERVER_ADDRESS: address + ':' + back_port,
    FRONTEND_SERVER_ADDRESS: address + ':' + front_port,
    BLEF_SERVER_ADRESS_FOR_CLIENT: process.env.BLEF_SERVER_ADRESS_FOR_CLIENT,
}
