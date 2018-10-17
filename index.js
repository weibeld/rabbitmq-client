const readline = require('readline');
const amqp = require('amqplib');

const amqpUri = process.argv[2];
if (!amqpUri) throw new Error('first argument must be AMQP URI');

let connection;
let channel;
let cli;

/* Connect to RabbitMQ and create channel */
amqp.connect(amqpUri)
    .then(conn => {
        console.log('Connection established');
        connection = conn;
        return conn.createChannel()
    })
    .then(ch => {
        console.log('Channnel created');
        channel = ch;
        startCli();
    })
    .catch(err => console.log(err));

function startCli() {
    cli = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: null
    });
    cli.setPrompt('> ');
    cli.on('line', parseCommand);
    console.log(`
This program allows you to send messages to a queue of the specified RabbitMQ instance.
Queues are assumed to be non-exclusive, non-durable, and auto-delete. Queues are created
with these parameters if they don't exist.

Format: QUEUE MESSAGE
Type 'quit' to exit.
`);
    cli.prompt();
}

function parseCommand(cmd) {
    if (cmd === 'quit') close();
    else if (cmd !== '') {
        const [ queue, ...msg ] = cmd.split(' ');
        send(queue, msg.join(' '));
        cli.prompt();
    }
}

async function send(queue, msg) {
    console.log(`Sending to queue '${queue}': ${msg}`);
    try {
        await channel.assertQueue(queue, {durable: false, autoDelete: true});
        channel.sendToQueue(queue, Buffer.from(msg));
    } catch (err) {
        console.log(err);
    }
}

async function close() {
    await connection.close();
    console.log('Connection closed')
    process.exit();
}
