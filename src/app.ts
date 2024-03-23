import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errors.middleware';
import { config } from '../config';
import path from 'path';

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/public')));
}

app.use(
    cors({
        origin: [
            config.FRONTEND_SERVER_ADDRESS,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5678',
            'http://localhost:5678/socket.io',
            'http://localhost:5678/socket.i',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Specify the allowed HTTP methods
        credentials: false,
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(notFound);
app.use(errorHandler);

export default app;
