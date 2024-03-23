import app from './app';
import http from 'http';
import session from 'express-session';
import { config } from '../config';
import { BlefServer } from './BlefServer';
const port = config.BACKENDSERVERPORT || 5678;

// TODO: Reconsider using sessionId as identifier. Pro: this would remove need for usernames map since one could just get the data from session stroage. Con: Security?

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});
const sessionConfig = session({
    resave: true,
    saveUninitialized: true,
    secret: 'pizda', // :O
    rolling: false,
});

app.set('trust proxy', 1); // trust first proxy
app.use(sessionConfig);

let blefServer = new BlefServer(server);
