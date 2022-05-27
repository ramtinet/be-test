import pino from 'pino';

const pinoInstance = pino({
  name: 'test-server',
  timestamp: pino.stdTimeFunctions.isoTime
});

export default pinoInstance;
