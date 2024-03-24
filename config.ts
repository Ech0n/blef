const back_port = 5678;
const front_port = 5173;

export const config = {
    BACKENDSERVERPORT: 5678,
    FRONTENDSERVERPORT: 5173,
    HOSTNAME: '192.168.0.27',
    BACKEND_SERVER_ADDRESS: 'http://192.168.0.27:' + back_port,
    FRONTEND_SERVER_ADDRESS: 'http://192.168.0.27:' + front_port,
};
