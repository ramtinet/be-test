import { Socket } from 'socket.io';
import { validateLoginCredentials } from './login.validation';
import mockRedis from "./../mockRedis";
import { LoginCredentials } from "./../types/logincredentials.types";

const loginSocketIOController = (client_socket: Socket, io: any) => {
    client_socket.on("LOGIN", (loginCredentials: LoginCredentials, callback) => {
        try {
            validateLoginCredentials(loginCredentials);
            const name: string = loginCredentials.name;
            mockRedis.sockets[name] = client_socket;
            client_socket.emit("LOGIN", {})
        } catch (error: any) {
            callback({
                errorMessage: 'error',
                errorObject: error
            });
        }
    })
};

export default loginSocketIOController;