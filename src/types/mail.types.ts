import { RequestHandler } from 'express';

export type Mail = {
  message: string,
  recipient: string;
  prio: boolean;
}

export type SendMail = RequestHandler<{}, Mail, Mail, {}>

export type GetMail = RequestHandler<{ mailbox: string }, Mail[], {}, {}>
