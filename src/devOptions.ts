type DevOptions = Record<string, CorsOptions | SocketOptions>;
type CorsOptions = Record<string, string | number>;
type SocketOptions = Record<string, string | Record<string, string>>;

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) can't handle 204
};

const socketOptions: SocketOptions = {
    cors: {
      origin: "http://localhost:3000"
    }
};

const devOptions: DevOptions = {
    corsOptions: corsOptions,
    socketOptions: socketOptions
}

export default devOptions;
export type {CorsOptions, DevOptions, SocketOptions};