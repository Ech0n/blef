const back_port = 5678;
const front_port = 5173;

export const config = {
    BACKENDSERVERPORT: 5678,
    FRONTENDSERVERPORT: 5173,
    BACKEND_SERVER_ADDRESS: 'http://192.168.0.129:' + back_port,
    FRONTEND_SERVER_ADDRESS: 'http://192.168.0.129:' + front_port,
    sessionSecret: 'ddd', // 0:
};
