import { Mail } from '../types/mail.types';
import { validateMail } from './mailbox.validation';

const tryValidator = (validator) => {
  let passed: boolean;
  try{
    validator();
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
    const passed: boolean = tryValidator(validateMail.bind(mailInput));
    expect(passed).toEqual(false);  
  });

  it('it should not pass if recipient is a blank-string', async () => {
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "        ",
        prio: false
    };
    const passed: boolean = tryValidator(validateMail.bind(mailInput));
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
    const passed: boolean = tryValidator(validateMail.bind(mailInput));
    expect(strSize21.length).toBeGreaterThan(length);
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
    const passed: boolean = tryValidator(validateMail.bind(mailInput));
    expect(strSize301.length).toBeGreaterThan(length);
    expect(passed).toEqual(false);  
  });
});
