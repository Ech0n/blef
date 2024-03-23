import app from './app';
import http from 'http';
import { config } from '../config';
import { BlefServer } from './BlefServer';
const port = config.BACKENDSERVERPORT || 5678;

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});

app.set('trust proxy', 1); // trust first proxy

let blefServer = new BlefServer(server);
