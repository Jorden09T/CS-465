const { read } = require('fs');
const mongoose = require('mongoose');
const host = process.env.DB_Host || '127.8.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');


const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
    }), 1000);
}

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`)
});

mongoose.connection.on('error', () => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Disconnected');
});

if (process.platform == 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r1.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
    });
}

process.once('SIGUSR2', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});

process.on('SIGINT', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown');
    process.exit(0);
});

connect();

require('./travlr');
module.exports = mongoose;