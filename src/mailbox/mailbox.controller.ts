import { Mail } from '../types/mail.types'

import { getElementsInList, addElementToList } from 'pkg-redis/redis.controller'
import { validateMail } from './mailbox.validation'
import { REDIS_QUEUES } from '../queue/queue.const'
import log from '../services/logging.service'

export default class MailBox {
  public static async sendMail(mail: Mail) {
    validateMail(mail);
    log.debug({ ...mail, queue: REDIS_QUEUES.MAILBOX }, 'Send mail')
    await addElementToList<Mail>(mail, REDIS_QUEUES.MAILBOX);
    return mail;
  }

  public static async checkMails(mailbox: string) {
    return await getElementsInList<Mail>(mailbox);
  }
}

export const addMailToMailbox = async (mail: Mail): Promise<Mail> => {
  validateMail(mail);

  await addElementToList<Mail>(mail, REDIS_QUEUES.MAILBOX);
  return mail;
}