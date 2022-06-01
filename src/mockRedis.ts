import { Socket } from 'socket.io';
interface MockRedis {
    sockets: Record<string, Socket>,
}
const mockRedis: MockRedis = {
    sockets: {}
};

export default mockRedis;
