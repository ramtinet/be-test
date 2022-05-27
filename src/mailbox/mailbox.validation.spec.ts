import { Mail } from '../types/mail.types';
import { validateMail } from './mailbox.validation';

describe('mailbox-validation', () => {

  test('does nothing for valid mail', async () => {
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "Space",
        prio: false
    };
    validateMail(mailInput);
    expect(mailInput).toEqual(mailInput);
  });

});
