import EventEmitter from 'events';

import { DeliverySystemEnums } from './postoffice.enums';
import { Mail } from '../types/mail.types';

export default class PostOffice {
  public static async distributeMailsFromPostOffice() {
    // To be implemented
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
