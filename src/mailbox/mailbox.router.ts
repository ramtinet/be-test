import express from 'express';
import Mailbox from './mailbox.controller';
import { SendMail, GetMail } from '../types/mail.types'

const router = express.Router();

// /mail
const POST_mail: SendMail = (req, res, next) => {
  Mailbox.sendMail(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err: Error) => next(err));
}

// /mail/:mailbox
const GET_mail: GetMail = (req, res, next) => {
  const mailbox: string = req.params.mailbox;
  Mailbox.checkMails(mailbox)
    .then((data) => {
      res.send(data);
    })
    .catch((err: Error) => next(err));
}

router.post('/', POST_mail);
router.get('/:mailbox', GET_mail);

export default router;
