import config from 'config';
import { QueueConfig } from './queue.types';

const {
  mailbox_queue: MAILBOX,
  postoffice_queue: POSTOFFICE,
} = config.get<QueueConfig>('redis');

export const REDIS_QUEUES = {
  MAILBOX,
  POSTOFFICE
} as const;
