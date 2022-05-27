import config from 'config';

import log from './services/logging.service';
import PostOffice from './postoffice/postoffice.controller';
import Mailman from './mailman/mailman.controller';


const CYCLE_TIMER = config.get<{ cycle_timer: number }>('app').cycle_timer;

export default class Cycle {
  private static timer: NodeJS.Timeout;

  public static start(): void {
    Cycle.timer = setTimeout(Cycle.mainCycle, CYCLE_TIMER);
  }

  public static stop(): void {
    if (Cycle.timer) {
      clearInterval(Cycle.timer);
    }
  }

  public static mainCycle(): void {
    Mailman.checkMailBoxAndDeliverToPostOffice()
      .then(() => PostOffice.distributeMailsFromPostOffice())
      .catch((err) => {
        log.error(err);
      })
      .finally(() => {
        Cycle.timer = setTimeout(Cycle.mainCycle, CYCLE_TIMER);
      });
  }
}
