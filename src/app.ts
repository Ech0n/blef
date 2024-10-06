import express, { Request, Response } from 'express'
import cors from 'cors'
import { notFound, errorHandler } from './middlewares/errors.middleware'
import { config } from '../config'
import path from 'path'

const app = express()

if (config.mode === 'production') {
    app.use(express.static('public'))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })
}

app.use(
    cors({
        origin: [config.ADDRES, config.FRONTEND_SERVER_ADDRESS],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Specify the allowed HTTP methods
        credentials: false,
    })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(notFound)
app.use(errorHandler)

export default app
