import { validateLoginCredentials } from './login.validation';
import mockRedis from "./../mockRedis";
import { LoginCredentials } from "./../types/logincredentials.types";

const loginSocketIOController = (client_socket, io) => {
    client_socket.on("LOGIN", (loginCredentials: LoginCredentials) => {
        validateLoginCredentials(loginCredentials);
        const {name} = loginCredentials;
        mockRedis.sockets[name] = client_socket;
        client_socket.emit("LOGIN", {requestFailed: false})
    })
};

export default loginSocketIOController;