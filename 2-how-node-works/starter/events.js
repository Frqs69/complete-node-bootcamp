const EventEmitter = require('events');
const http = require('http');


class Sales extends EventEmitter {
    constructor(){
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log('There was a new sale')
});

myEmitter.on('newSale', () => {
    console.log("Customer name: Kamil")
})

myEmitter.on('newSale', stock => {
    console.log(`There are now ${stock} items left in stock`)
})

myEmitter.emit('newSale',9);


////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request received!')
    res.end("Request received")
})

server.on('request', (req, res) => {
    console.log("Request another")
})

server.on('close', () => {
    console.log('Server closed')
})

server.listen(8000,'localhost', ()=>{
    console.log('Waiting for request...')
})