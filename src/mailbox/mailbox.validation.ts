import { object, string, boolean, assert } from 'superstruct'
import { Mail } from '../types/mail.types'

export const validateMail = (mail: Mail) => assert(mail, object({ message: string(), recipient: string(), prio: boolean() }));