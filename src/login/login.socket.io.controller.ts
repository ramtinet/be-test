import mockRedis from "../mockRedis";
const loginSocketIOController = (client_socket, io) => {
    client_socket.on("LOGIN", (data) => {
        const {name} = data;
        mockRedis.sockets[name] = client_socket;
        client_socket.emit("LOGIN", {requestFailed: false})
    })
};

export default loginSocketIOController;