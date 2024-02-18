import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import api from './api'; // Ensure this is exported correctly in the respective file
import { notFound, errorHandler } from './middlewares/errors.middleware'; // Ensure these are exported correctly

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
        message: '📦 Svelte Express Boilerplate 📦',
    });
});

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

export default app;
