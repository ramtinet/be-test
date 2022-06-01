import { LoginCredentials } from './../types/logincredentials.types';
import { validateLoginCredentials } from './login.validation';

describe('mailbox-validation', () => {
  test('does nothing for valid mail', async () => {
    const loginCredentials: LoginCredentials = {
        name: "Martin",
    };
    validateLoginCredentials(loginCredentials);
    expect(loginCredentials).toEqual(loginCredentials);
  });

});
