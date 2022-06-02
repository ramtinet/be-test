import { Mail } from '../types/mail.types';
import { validateMail } from './mailbox.validation';

describe('mailbox-validation', () => {
  it('it should not pass if recipient is an empty string', async () => {
    let passed, shouldNotPass: boolean;
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "",
        prio: false
    };
    try{
      validateMail(mailInput);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(shouldNotPass).toEqual(true);  
  });

  it('it should not pass if recipient is a blank-string', async () => {
    let passed, shouldNotPass: boolean;
    const mailInput: Mail = {
        message: "Hello world",
        recipient: "        ",
        prio: false
    };
    try{
      validateMail(mailInput);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(shouldNotPass).toEqual(true);  
  });

  it('it should not pass if recipient has length > 20', async () => {
    let passed, shouldNotPass: boolean;
    const strSize21 = new Array(20 + 2).join('a');
    const mailInput: Mail = {
        message: "Hello world",
        recipient: strSize21,
        prio: false
    };
    try{
      validateMail(mailInput);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(strSize21.length).toBeGreaterThan(20);
    expect(shouldNotPass).toEqual(true);  
  });

  it('it should not pass if message has length > 300', async () => {
    let passed, shouldNotPass: boolean;
    const strSize301 = new Array(300 + 2).join('a');
    const mailInput: Mail = {
        message: strSize301,
        recipient: "Martin",
        prio: false
    };
    try{
      validateMail(mailInput);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(strSize301.length).toBeGreaterThan(20);
    expect(shouldNotPass).toEqual(true);  
  });
});
