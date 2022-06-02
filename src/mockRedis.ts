type UserName = string;
type SocketId = Record<string,  string>;
interface MockRedis {
    users: Record<UserName,  SocketId>
}
const mockRedis: MockRedis = {
    users: {},
};

export default mockRedis;
