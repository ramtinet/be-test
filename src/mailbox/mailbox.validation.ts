import { object, string, boolean, assert } from 'superstruct'
import { Mail } from '../types/mail.types'

const MailStruct = object({ 
    message: string(), 
    recipient: string(), 
    prio: boolean()
});

export const validateMail = (mail: Mail) => assert(mail, MailStruct);