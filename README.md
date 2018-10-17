# Simple RabbitMQ Client

This Node.js program allows to connect to a RabbitMQ server and interactively send messages to any queue.

Queues that don't exist are created on the server.

Existing queues are assumed to have the following parameters:

- Exclusive: false
- Durable: false
- Auto-delete: true

Queues that don't exist are created with these parameters.

## Usage

~~~bash
node index.js AMQP_URI
~~~

Or:

~~~bash
npm run start AMQP_URI
~~~

The format for the interactive CLI is:

~~~
> QUEUE MESSAGE
~~~

For example:

~~~
> my-queue This is my message
~~~
