import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import config from 'config';
import socketio, { Socket } from "socket.io";
import mailRouter from './mailbox/mailbox.router';
import log from './services/logging.service';
import cors from "cors";
import globalVars from './globalVars';

const devOptions = {
  corsOptions: {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) can't handle 204
  },
  socketIOOptions: {
    cors: {
      origin: "http://localhost:3000"
    }
  }
}

const PORT = config.get<{ port: number }>('app').port;

export default class Server {
  private static expressApp = express();
  private static http = http.createServer(this.expressApp);
  private static serverInstance: http.Server;
  public static io = new socketio.Server(this.http, devOptions.socketIOOptions);
  public static socket: Socket;

  public static start(): Promise<void> {
    this.expressApp.use(cors(devOptions.corsOptions));
    this.addRoutes();
    this.startSocketIO();

    return new Promise((resolve) => {
      this.serverInstance = this.http.listen(PORT, () => {
        log.info('Listening on port %s', PORT);
        return resolve();
      });
    });
  }

  private static addRoutes() {
    this.expressApp.use(express.json());
    this.expressApp.use('/mail', mailRouter);
    this.expressApp.use(this.errorMiddleware);
  }

  private static startSocketIO(){
    this.io.on('connection', (socket: Socket) => {
      console.log('We have a new connection!!!', socket.id);
      socket.on("LOGIN", (data) => {
        const {name} = data;
        globalVars.sockets[name] = socket;
        socket.emit("LOGIN", {requestFailed: false})
      })
      this.socket = socket;
    });
  }

  public static stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.serverInstance) {
        return resolve();
      }
      this.serverInstance.close(() => {
        return resolve();
      });
    });
  }

  private static errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err, 'errorMiddleware request');
    res.status(500).send({ name: err.name, message: err.message, stack: err.stack });
    next();
  }
}
