import { LoginCredentials } from './../types/logincredentials.types';
import { validateLoginCredentials } from './login.validation';

type LoginCredentialsValidator = (loginCredentials: LoginCredentials) => void;
const tryLoginCredentialsValidator = (loginCredentials: LoginCredentials, validator: LoginCredentialsValidator) => {
  let passed: boolean;
  try{
    validator(loginCredentials);
    passed = true;
  } catch (e) {
    passed = false;
  }
  return passed;
}

describe('login-validation', () => {
  it('it should not pass if name is an empty-string', async () => {
    const loginCredentials: LoginCredentials = {
        name: "",
    };
    const passed = tryLoginCredentialsValidator(loginCredentials, validateLoginCredentials);
    expect(passed).toEqual(false);
  });

  it('it should not pass if name is a blank-string', async () => {
    const loginCredentials: LoginCredentials = {
        name: "   ",
    };
    const passed = tryLoginCredentialsValidator(loginCredentials, validateLoginCredentials);
    expect(passed).toEqual(false);
  });

  it('it should not pass if name has length > 20', async () => {
    const length: number = 20;
    const strSize21: string = new Array(length + 2).join('a');
    const loginCredentials: LoginCredentials = {
        name: strSize21,
    };
    const passed = tryLoginCredentialsValidator(loginCredentials, validateLoginCredentials);
    expect(strSize21.length).toBeGreaterThan(length);
    expect(passed).toEqual(false);
  });

});
