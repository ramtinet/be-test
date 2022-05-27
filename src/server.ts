import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import config from 'config';

import mailRouter from './mailbox/mailbox.router';
import log from './services/logging.service';

const PORT = config.get<{ port: number }>('app').port;

export default class Server {
  private static expressApp = express();
  private static serverInstance: http.Server;

  public static start(): Promise<void> {
    this.addRoutes();

    return new Promise((resolve) => {
      this.serverInstance = this.expressApp.listen(PORT, () => {
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
