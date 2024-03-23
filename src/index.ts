import app from './app';
import http from 'http';
import { config } from '../config';
import { BlefServer } from './BlefServer';
const port = config.BACKENDSERVERPORT || 5678;
const hostname = config.HOSTNAME;

<<<<<<< HEAD
// TODO: Reconsider using sessionId as identifier. Pro: this would remove need for usernames map since one could just get the data from session stroage. Con: Security?

const server = http.createServer(app).listen(port, hostname, () => {
    console.log(`Server is up at port http://{}:${port}`);
=======
const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
>>>>>>> b0d721faab0ccae7114a18df48718ad0b76d9949
});

app.set('trust proxy', 1); // trust first proxy

let blefServer = new BlefServer(server);
