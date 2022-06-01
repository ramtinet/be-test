import { LoginCredentials } from './../types/logincredentials.types';
import { object, string, nonempty, assert } from 'superstruct'

const LoginCredentialsStruct = object({ 
    name: nonempty(string()), 
});

const EmptyString = nonempty(string());

export const validateLoginCredentials = (loginCredentials: LoginCredentials) => {
    // Validate that the incoming name isn't empty (e.g; "")
    assert(loginCredentials, LoginCredentialsStruct);
    // Edge-case: Validate that the incoming name isn't blank (e.g; "       ")
    assert(loginCredentials.name.trim(), EmptyString);
};