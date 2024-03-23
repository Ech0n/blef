import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import api from './api';
import { notFound, errorHandler } from './middlewares/errors.middleware';
import { config } from '../config';

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/public'));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
    });
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

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: '...',
    });
});

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

export default app;
