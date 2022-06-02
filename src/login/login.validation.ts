import { LoginCredentials } from './../types/logincredentials.types';
import { object, string, nonempty, assert, size } from 'superstruct'

const LoginCredentialsStruct = object({ 
    name: size(nonempty(string()), 1, 20), 
});

const EmptyString = nonempty(string());

export const validateLoginCredentials = (loginCredentials: LoginCredentials) => {
    // Validating the incoming credentials
    assert(loginCredentials, LoginCredentialsStruct);
    // Edge-case: Validate that the incoming name isn't blank (e.g; "       ")
    assert(loginCredentials.name.trim(), EmptyString);
};