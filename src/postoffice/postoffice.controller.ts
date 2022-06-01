import EventEmitter from 'events';
import { addElementToList, getElementsFromListAndRemoveList, getLengthOfList} from 'pkg-redis/redis.controller'
import { DeliverySystemEnums } from './postoffice.enums';
import { Mail } from '../types/mail.types';
import { REDIS_QUEUES } from '../queue/queue.const'
const { POSTOFFICE } = REDIS_QUEUES;

export default class PostOffice {
  public static async distributeMailsFromPostOffice() {
    const length: number = await getLengthOfList(POSTOFFICE);
    if(length > 0){
      const incomingPostOfficeQueue: Mail[] = await getElementsFromListAndRemoveList(POSTOFFICE);
      incomingPostOfficeQueue.forEach(mail => {
        const {recipient} = mail;
        addElementToList<Mail>(mail, recipient);
        DeliverySystem.triggerMailManDelivery(mail);
      })
    }
  }
}

export class DeliverySystem {
  private static eventEmitter = new EventEmitter();

  public static triggerSendMail(mail: Mail) {
    this.eventEmitter.emit(DeliverySystemEnums.SEND_MAIL, mail);
  }

  public static triggerMailManDelivery(mail: Mail) {
    this.eventEmitter.emit(DeliverySystemEnums.SEND_MAILMAIN, mail);
  }

  public static applyOn(event: DeliverySystemEnums, cb: (...args: any[]) => void) {
    this.eventEmitter.on(event, cb);
  }
}
