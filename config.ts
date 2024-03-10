const back_port = 5678;
const front_port = 5173;

export const config = {
    BACKENDSERVERPORT: 5678,
    FRONTENDSERVERPORT: 5173,
    BACKEND_SERVER_ADDRESS: 'localhost:' + back_port,
    FRONTEND_SERVER_ADDRESS: 'localhost:' + front_port,
    sessionSecret: 'pizda', // 0:
};
