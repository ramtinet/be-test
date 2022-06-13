import { Mail } from '../types/mail.types';
import { validateMail } from './mailbox.validation';

const tryMailValidator = (mail: Mail) => {
  let passed: boolean;
  try{
    validateMail(mail);
    passed = true;
  } catch (e) {
    passed = false;
  }
  return passed;
}

describe('mailbox-validation', () => {
  it('it should not pass if recipient is an empty string', async () => {
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "",
        prio: false
    };
    const passed: boolean = tryMailValidator(mailInput);
    expect(passed).toEqual(false);  
  });

  it('it should not pass if recipient is a blank-string', async () => {
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "        ",
        prio: false
    };
    const passed: boolean = tryMailValidator(mailInput);
    expect(passed).toEqual(false);  
  });

  it('it should not pass if recipient has length > 20', async () => {
    const length: number = 20;
    const strSize21: string = new Array(length + 2).join('a');
    const mailInput: Mail = {
        message: "Hello world",
        recipient: strSize21,
        prio: false
    };
    const passed: boolean = tryMailValidator(mailInput);
    expect(strSize21.length).toEqual(length+1);
    expect(passed).toEqual(false);  
  });

  it('it should not pass if message has length > 300', async () => {
    const length: number = 300;
    const strSize301: string = new Array(length + 2).join('a');
    const mailInput: Mail = {
        message: strSize301,
        recipient: "Martin",
        prio: false
    };
    const passed: boolean = tryMailValidator(mailInput);
    expect(strSize301.length).toEqual(length+1);
    expect(passed).toEqual(false);  
  });
});
