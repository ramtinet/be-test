import { Socket } from 'socket.io';
interface GlobalVars {
    sockets: Record<string, Socket>,
}
const globalVars: GlobalVars = {
    sockets: {}
};

export default globalVars;
