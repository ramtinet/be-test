import { Socket } from 'socket.io';
import { DeliverySystem } from '../postoffice/postoffice.controller'
import { DeliverySystemEnums } from '../postoffice/postoffice.enums'
import { Mail } from '../types/mail.types'
import { addElementToList, getElementsFromListAndRemoveList, getLengthOfList} from 'pkg-redis/redis.controller'
import { REDIS_QUEUES } from '../queue/queue.const';
import mockRedis from '../mockRedis';

const { MAILBOX, POSTOFFICE } = REDIS_QUEUES;

// type GetAndSetFn<T> = (composition: T | undefined) => T | undefined;
export default class MailMan {
  public static async checkMailBoxAndDeliverToPostOffice() {
    const length: number = await getLengthOfList(MAILBOX);
    if(length > 0){
      const incomingMailQueue: Mail[] = await getElementsFromListAndRemoveList(MAILBOX);
      incomingMailQueue.forEach(mail => {
        addElementToList<Mail>(mail, POSTOFFICE);
      })
    }
  }

  public static async deliverMailToRecipient(mail: Mail) {
    const {recipient} = mail;
    const {sockets} =  mockRedis;
    const recipientSocket: Socket = sockets[recipient];
    recipientSocket.emit('INCOMING_MAIL', mail);
  }
}

// Call "deliverMailToRecipient" function whenever the event "SEND_MAILMAIN is triggered
DeliverySystem.applyOn(DeliverySystemEnums.SEND_MAILMAIN, MailMan.deliverMailToRecipient);
