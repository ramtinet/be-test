import { LoginCredentials } from './../types/logincredentials.types';
import { object, string, assert } from 'superstruct'

const LoginCredentialsStruct = object({ 
    name: string(), 
});

export const validateLoginCredentials = (loginCredentials: LoginCredentials) => assert(loginCredentials, LoginCredentialsStruct);