import { LoginCredentials } from './../types/logincredentials.types';
import { object, string, nonempty, assert } from 'superstruct'

const LoginCredentialsStruct = object({ 
    name: nonempty(string()), 
});

export const validateLoginCredentials = (loginCredentials: LoginCredentials) => assert(loginCredentials, LoginCredentialsStruct);