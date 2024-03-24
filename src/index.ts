import app from './app';
import http from 'http';
import { config } from '../config';
import { BlefServer } from './BlefServer';
const port = config.BACKENDSERVERPORT || 5678;
const hostname = config.HOSTNAME;

const server = http.createServer(app).listen(port, hostname, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});

app.set('trust proxy', 1); // Trust first proxy!

let blefServer = new BlefServer(server);
