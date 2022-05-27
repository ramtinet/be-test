import redisMock from 'redis-mock';
import Redis from '~pkg-redis/redis.service';

export default class RedisMock {
  public static connect() {
    const client = redisMock.createClient({
      prefix: 'local',
    });

    return Redis.connect(client as any);
  }
}
