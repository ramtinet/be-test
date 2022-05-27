import { DeliverySystem } from '../postoffice/postoffice.controller'
import { DeliverySystemEnums } from '../postoffice/postoffice.enums'
import { Mail } from '../types/mail.types'

export default class MailMan {
  public static async checkMailBoxAndDeliverToPostOffice() {
    // To be implemented
  }

  public static async deliverMailToRecipient(mail: Mail) {
    // To be implemented
  }
}

DeliverySystem.applyOn(DeliverySystemEnums.SEND_MAILMAIN, MailMan.deliverMailToRecipient);