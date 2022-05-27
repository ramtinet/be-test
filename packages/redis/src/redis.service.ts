import { URL } from 'url';
import { promisify } from 'util';
import { createClient, RedisClient, Commands, RedisError } from 'redis';
import { GetAndSetFnReturnValue, GetAndSetFn, GetAndSetFnType, GetAndSetConditionFn } from './redis.types';

const url = process.env.REDIS_URL || '';

export default class Redis {
  public static client: RedisClient;
  private static rpop_bind: Commands<unknown>['rpop'];
  private static quit_bind: Commands<unknown>['quit'];
  private static get_bind: Commands<unknown>['get'];
  private static ping_bind: Commands<unknown>['ping'];
  private static del_bind: Commands<unknown>['del'];
  private static lrem_bind: Commands<unknown>['lrem'];
  private static rpush_bind: Commands<unknown>['rpush'];
  private static lpush_bind: Commands<unknown>['lpush'];
  private static lrange_bind: Commands<unknown>['lrange'];
  private static set_bind: Commands<unknown>['set'];
  private static llen_bind: Commands<unknown>['llen'];
  private static scan_bind: Commands<unknown>['scan'];

  public static async connect(
    client: RedisClient = createClient({
      url,
    })
  ): Promise<void | Error> {
    Redis.client = await Redis.awaitConnection(client);
    Redis.client
      .on('error', (err) => {
        console.error(err, 'Redis error');
      })
      .on('reconnecting', () => {
        console.warn('Redis reconnecting.');
      });

    Redis.quit_bind = promisify(Redis.client.quit).bind(Redis.client);
    Redis.get_bind = promisify(Redis.client.get).bind(Redis.client);
    Redis.lrange_bind = promisify(Redis.client.lrange).bind(Redis.client);
    Redis.rpush_bind = promisify(Redis.client.rpush).bind(Redis.client);
    Redis.lpush_bind = promisify(Redis.client.lpush).bind(Redis.client);
    Redis.lrem_bind = promisify(Redis.client.lrem).bind(Redis.client);
    Redis.rpop_bind = promisify(Redis.client.rpop).bind(Redis.client);
    Redis.del_bind = promisify(Redis.client.del).bind(Redis.client);
    Redis.set_bind = promisify(Redis.client.set).bind(Redis.client);
    Redis.llen_bind = promisify(Redis.client.llen).bind(Redis.client);
    Redis.scan_bind = promisify(Redis.client.scan).bind(Redis.client);
    Redis.ping_bind = promisify(Redis.client.ping).bind(Redis.client);
  }

  static async awaitConnection(client: RedisClient, showlogging = true): Promise<RedisClient> {
    return new Promise((resolve) => {
      client.on('connect', () => {
        if (url && showlogging) {
          const redisUrl = new URL(url);
          console.info('Redis connected on: %s', redisUrl.host);
        }
        return resolve(client);
      });
    });
  }

  public static async disconnect(): Promise<string | void> {
    if (!Redis.client || (Redis.client && !Redis.client.connected)) {
      return Promise.resolve();
    }
    return Redis.quit_bind() as Promise<string>;
  }

  public static del(key: string | string[]): Promise<number> {
    return Redis.del_bind(key) as Promise<number>;
  }

  public static rpop<T>(fromQueue: string): Promise<T> {
    return (Redis.rpop_bind(fromQueue) as Promise<string>).then((value?) => JSON.parse(value) as T);
  }

  public static get<T>(key: string): Promise<T> {
    return (Redis.get_bind(key) as Promise<string>).then((value?) => JSON.parse(value) as T);
  }

  public static lrange<T>(queue: string): Promise<T[] | []> {
    return (Redis.lrange_bind(queue, 0, -1) as Promise<string[]>).then((value) =>
      value.map((item) => JSON.parse(item) as T)
    );
  }

  public static llen(queue: string): Promise<number> {
    return Redis.llen_bind(queue) as Promise<number>;
  }

  public static lrem<T>(value: T, queue: string): Promise<number> {
    const stringValue = JSON.stringify(value);
    return Redis.lrem_bind(queue, 1, stringValue) as Promise<number>;
  }

  public static rpush<T>(value: T, queue: string): Promise<number> {
    const stringValue = JSON.stringify(value);
    return Redis.rpush_bind(queue, stringValue) as Promise<number>;
  }

  public static lpush<T>(value: T, queue: string): Promise<number> {
    const stringValue = JSON.stringify(value);
    return Redis.lpush_bind(queue, stringValue) as Promise<number>;
  }

  public static set<T>(key: string, value: T): Promise<string> {
    const stringValue = JSON.stringify(value);
    return Redis.set_bind(key, stringValue) as Promise<string>;
  }

  public static scan(cursor: string, pattern: string): Promise<string[]> {
    return Redis.scan_bind(cursor, 'MATCH', pattern, 'COUNT', '1000') as Promise<string[]>;
  }

  public static ping(): Promise<boolean> {
    return (Redis.ping_bind() as Promise<string>).then((value?) => value === 'PONG');
  }

  public static multiLrangeDel<T>(queue: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      Redis.client
        .multi()
        .lrange(queue, 0, -1)
        .del(queue)
        .exec((err, [list]) => {
          if (err) {
            reject(err);
          }
          resolve((list as string[]).map((m) => JSON.parse(m) as T));
        });
    });
  }

  public static watchMultiGetSet<T>(
    key: string,
    getAndSetFn: GetAndSetFn<T>,
    getAndSetConditionFn?: GetAndSetConditionFn<T>
  ): GetAndSetFnReturnValue<T> {
    const client = Redis.client.duplicate();
    return Redis.awaitConnection(client, false).then((watcher) => {
      return new Promise((_resolve, _reject) => {
        // wrap promisefuncs to always disconnect client
        const resolve = (v: GetAndSetFnType<T>) => {
          watcher.quit();
          _resolve(v);
        };
        const reject = (v: RedisError | null) => {
          watcher.quit();
          _reject(v);
        };
        watcher.watch(key, (watchError) => {
          if (watchError) reject(watchError);
          watcher.get(key, (getError, getResult) => {
            if (getError) reject(watchError);
            if (!getResult) {
              return resolve({ hasConditionPassed: false, results: null, value: undefined });
            }
            const JSONValue = JSON.parse(getResult) as T;
            const hasConditionPassed = getAndSetConditionFn ? getAndSetConditionFn(JSONValue) : true;
            if (!hasConditionPassed) {
              return resolve({ hasConditionPassed, results: [], value: JSONValue });
            }
            const object = getAndSetFn(JSONValue);
            const value = JSON.stringify(object);
            watcher
              .multi()
              .set(key, value)
              .exec((execError, results: string[]) => {
                if (execError) reject(execError);
                resolve({ hasConditionPassed, results, value: object });
              });
          });
        });
      });
    });
  }
}
