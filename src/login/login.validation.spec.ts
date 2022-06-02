import { LoginCredentials } from './../types/logincredentials.types';
import { validateLoginCredentials } from './login.validation';

describe('login-validation', () => {
  it('it should not pass for empty-string', async () => {
    let passed, shouldNotPass: boolean;
    const loginCredentials: LoginCredentials = {
        name: "",
    };
    try{
      validateLoginCredentials(loginCredentials);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(shouldNotPass).toEqual(true);
  });

  it('it should not pass for blank-string', async () => {
    let passed, shouldNotPass: boolean;
    const loginCredentials: LoginCredentials = {
        name: "   ",
    };
    try{
      validateLoginCredentials(loginCredentials);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(shouldNotPass).toEqual(true);
  });

  it('it should not pass for string.length > 20', async () => {
    let passed, shouldNotPass: boolean;
    const strSize21 = new Array(20 + 2).join('a');
    const loginCredentials: LoginCredentials = {
        name: strSize21,
    };
    try{
      validateLoginCredentials(loginCredentials);
      passed = true;
    } catch (e) {
      passed = false;
    }
    shouldNotPass = !passed;
    expect(strSize21.length).toBeGreaterThan(20);
    expect(shouldNotPass).toEqual(true);
  });

});
