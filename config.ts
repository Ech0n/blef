const back_port = 5678;
const front_port = 5173;

// TODO: maybe we should use json for config
export const config = {
    BACKENDSERVERPORT: 5678,
    FRONTENDSERVERPORT: 5173,
    HOSTNAME: 'localhost',
    BACKEND_SERVER_ADDRESS: 'http://localhost:' + back_port,
    FRONTEND_SERVER_ADDRESS: 'http://localhost:' + front_port,
};
