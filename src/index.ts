import Server from './server';
import Cycle from './cycle';
import Redis from 'pkg-redis/redis.service';
import log from './services/logging.service';
import './mailman/mailman.controller';

if (!process.env.REDIS_URL) {
  throw new Error('Please specify all environmental variables.');
}

(function (): void {
  Promise.all([Redis.connect(), Server.start()])
    .then(() => {
      Cycle.start();
      log.info('Server started');
    })
    .catch((err) => {
      log.error(err);
      process.exit(1);
    });
})();

let closing = false;

const close = () => {
  if (!closing) {
    closing = true;
    log.info('Server stopping');
    Cycle.stop();
    Promise.all([Redis.disconnect(), Server.stop()])
      .catch((err) => {
        log.error(err);
      })
      .finally(() => {
        log.info('Server stopped');
        process.exit(0);
      });
  }
};

[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, (event) => {
    log.info('Shutting down from event: %s', event);
    close();
  });
});

process.on('exit', (signal) => {
  log.info(`Exiting with signal ${signal}`);
  close();
});

process.on('uncaughtException', (error, origin) => {
  log.error(error, `Caught %s error.`, origin);
  close();
});
