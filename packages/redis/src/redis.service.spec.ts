import RedisMock from 'redis-mock';
import Redis from '.';

describe('redis-service', () => {
  beforeAll(async () => {
    /**
     * Disclaimer, this watch mock doesn't provide the same
     * support as the real redis client does. But watch wasn't
     * supported by redis-mock at the time writing these tests.
     */
    RedisMock.RedisClient.prototype.watch = (key: any, callback: any) => {
      callback();
    };
    const client = RedisMock.createClient({
      prefix: 'local',
    });

    return Redis.connect(client as any);
  });

  afterAll(async () => {
    await Redis.disconnect();
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      Redis.client.flushall(() => {
        resolve();
      });
    });
  });

  test('set and get a value', async () => {
    await Redis.set(`valid:key`, { dogs: 'running' });
    let result = await Redis.get('valid:key');

    expect(result).toEqual({ dogs: 'running' });
  });

  test('watch multi get set condition has passed', async () => {
    const key = 'valid:key';
    await Redis.set(key, { dogs: 'running' });
    let result = await Redis.watchMultiGetSet<Object>(key, (o) => {
      if (!o) {
        return undefined;
      }

      return {
        ...o,
        cats: 'meowing',
      };
    });

    expect(result.hasConditionPassed).toEqual(true);
  });

  test('watch multi get set without condition', async () => {
    const key = 'valid:key';
    await Redis.set(key, { dogs: 'running' });
    let result = await Redis.watchMultiGetSet<Object>(key, (o) => {
      if (!o) {
        return undefined;
      }

      return {
        ...o,
        cats: 'meowing',
      };
    });

    expect(result.value).toEqual({
      dogs: 'running',
      cats: 'meowing',
    });
  });

  test('watch multi get set with false condition', async () => {
    const key = 'valid:key';
    await Redis.set(key, { dogs: 'running' });
    let result = await Redis.watchMultiGetSet<any>(
      key,
      (o) => {
        if (!o) {
          return undefined;
        }

        return {
          ...o,
          cats: 'meowing',
        };
      },
      (o) => o.dogs === 'walking'
    );

    expect(result.value).toEqual({
      dogs: 'running',
    });
  });

  test('watch multi get set with true condition', async () => {
    const key = 'valid:key';
    await Redis.set(key, { dogs: 'running' });
    let result = await Redis.watchMultiGetSet<any>(
      key,
      (o) => {
        if (!o) {
          return undefined;
        }

        return {
          ...o,
          cats: 'meowing',
        };
      },
      (o) => o.dogs === 'running'
    );

    expect(result.value).toEqual({
      dogs: 'running',
      cats: 'meowing',
    });
  });

  test('watch multi return value null before json parsing', async () => {
    let result = await Redis.watchMultiGetSet<Object>('boom', (o) => {
      return o;
    });

    expect(result.hasConditionPassed).toEqual(false);
    expect(result.results).toEqual(null);
  });
});
