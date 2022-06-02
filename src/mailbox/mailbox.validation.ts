import { object, string, boolean, size, nonempty, assert } from 'superstruct'
import { Mail } from '../types/mail.types'

const MailStruct = object({ 
    message: size(string(), 1, 300), 
    recipient: size(nonempty(string()), 1, 20), 
    prio: boolean()
});

const EmptyString = nonempty(string());

export const validateMail = (mail: Mail) => {
    // Validating the incoming credentials
    assert(mail, MailStruct);
    // Edge-case: Validate that the incoming recipient isn't blank (e.g; "       ")
    assert(mail.recipient.trim(), EmptyString);
};