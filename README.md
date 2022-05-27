# Storykit BE Test
Create an event driven backend application where you control a postoffice to deliver incoming messages to a receipients mailbox. Our intent is not that this application should be production ready in any way. Skip steps that you feel are gold plating for the application.

Minimum feature set:
* Check mailbox: `curl --request GET   --url http://localhost:9000/mail/<ReceipientName>`
* Send messages. ```curl --request POST   --url http://localhost:9000/mail   --header 'Content-Type: application/json'   --data '{
"message": "test",
"recipient": "<ReceipientName>",
"prio": false
}'```

The flow of the application should be something like this: 

```
POST - Send Mail, Put Mail in Mailbox (place in Redis queue)
LOOP - Postman checks Mailbox and Mail is delivered to Postoffice.
LOOP - Postman sorts mail in Postoffice
LOOP - Postman deliver mail to recipient Mailbox (this is input (recipient) from Mail)
GET  - Received mail
```

Things we will look at and perhaps dicuss:
* Handle race conditions.
* Ensure that you're utilizing TypeScript.
* Git workflow.
* Unit testing.

The delivery of your solution to us should be in the form of a repository. Private or not, it's up to you. Just make sure to invite us to your repo if it's private. Your repository can but doesn't have to be a fork of this repository.

In this repository we have provided you with a boilerplate that you can use to start if you like. But feel free to change it and add the tools/framework etc to your liking. It should however utilize some form of message queue, the boilerplate includes a redis queue setup with some helpers within `packages/redis`.

We have also provided routes and controller for a mailbox in `src/mailbox/` and some boilerplating for a mainmain and postoffice in `src/mailman` and `src/postoffice`.
## Installing
1. Clone repo
2. Install [https://docs.docker.com/install/](Docker) and NodeJS ([https://github.com/nvm-sh/nvm](nvm is useful for this))
2. Run `npm i`
3. Run `docker compose up --build` to start the NodeJS service and Redis

## Testing
Run `npm test` to run the test suite.

Good luck!