import Bluebird from 'bluebird';
import _ from 'lodash';

import Redis from './redis.service';
import { ExecError, GetAndSetConditionFn, GetAndSetFn, GetAndSetFnReturnValue, PushDirection } from './redis.types';

export const getElementsFromListAndRemoveList = <T>(fromQueue: string): Promise<T[]> => {
  return Redis.multiLrangeDel<T>(fromQueue);
};

export const addElementToList = <T>(value: T, queue: string, direction: PushDirection = 'left'): Promise<number> => {
  if (direction === 'right') {
    return Redis.rpush<T>(value, queue);
  } else {
    return Redis.lpush<T>(value, queue);
  }
};

export const removeElementsFromList = <T>(value: T, queue: string): Promise<number> => {
  return Redis.lrem<T>(value, queue);
};

export const scanWithCursor = async (pattern: string): Promise<string[]> => {
  let cursor = '0';
  let fullIteration = false;
  const values: string[] = [];
  while (!fullIteration) {
    const [_cursor, ...keys] = await Redis.scan(cursor, pattern);
    values.push(...keys.flat());
    if (Number(_cursor) !== 0) {
      cursor = _cursor;
    } else {
      fullIteration = true;
    }
  }
  return values.flat();
};

export const getValuesFromPattern = async <T>(pattern: string): Promise<T[]> => {
  const scanedValues = await scanWithCursor(pattern);
  return Bluebird.map(scanedValues, (key) => Redis.get<T>(key));
};

export const remove = (compositionKeys: string[]): Promise<number> => {
  return Redis.del(compositionKeys);
};

export const getElementsInList = <T>(queue: string): Promise<T[]> => Redis.lrange<T>(queue);

export const getLengthOfList = (queue: string): Promise<number> => Redis.llen(queue);

export const updateWithRetries = <T>(
  key: string,
  getAndSetFn: GetAndSetFn<T>,
  numberOfRetries: number,
  getAndSetConditionFn?: GetAndSetConditionFn<T>
): GetAndSetFnReturnValue<T> => {
  const retryPromise = (
    retries: number,
    resolve: (v: GetAndSetFnReturnValue<T>) => void,
    reject: (err: Error) => void
  ): void =>
    void Redis.watchMultiGetSet<T>(key, getAndSetFn, getAndSetConditionFn)
      .then((value) => {
        if (value.results === null) {
          // log.debug(`Updating composition ${key} in redis failed, trying again.`);
          if (retries >= Number(numberOfRetries)) {
            const err = new Error(`Maximum amount of retries complete, please investigate further: ${key}`);
            reject(err);
          } else {
            setTimeout(() => retryPromise(++retries, resolve, reject), Math.floor(Math.random() * 100));
          }
          //Transaction was not able to complete, please try again if possible.
        } else {
          return resolve(Promise.resolve(value));
        }
      })
      .catch(reject);
  return new Promise((resolve, reject) => retryPromise(0, resolve, reject));
};

export const handleRedisExecError = (error: ExecError): Error => {
  switch (error.command) {
    case 'EXEC': {
      if (error.code === 'EXECABORT') {
        if (error.errors.length > 0) {
          const firstError = error.errors[0];
          if (firstError.command === 'SET' && firstError.code === 'ERR' && firstError.position === 0) {
            // Example failure Error
            // {command: 'EXEC',code: 'EXECABORT',errors: [{command: 'SET',args: ['storyboard:5fad4a904d7c5ecae6a6ecee:render:5fae60996982370b5c188c34'],code: 'ERR',position: 0,}],};
            return new Error('Not found');
          }
        }
      }
    }
  }

  return error;
};
