const back_port = 5678;
const front_port = 5173;

export const config = {
    BACKENDSERVERPORT: 5678,
    FRONTENDSERVERPORT: 5173,
    HOSTNAME: '10.244.172.231',
    BACKEND_SERVER_ADDRESS: 'http://10.244.172.231:' + back_port,
    FRONTEND_SERVER_ADDRESS: 'http://10.244.172.231:' + front_port,
    sessionSecret: 'pizda', // 0:
};
