const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    //solution 1 - only for test or local usage
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err)
    //     res.end(data);
    // })

    // solution 2 - streams - chunk by chunk
    // const readable = fs.createReadStream('test-file.txt')
    // readable.on('data', chunk =>{
    //     res.write(chunk)
    // })
    // readable.on('end', () => res.end())
    // readable.on('error', (err) => {
    //     console.log(err)
    //     res.statusCode = 500;
    //     res.end("File not found")
    // })

    //solution 3 - pipe
    const readable = fs.createReadStream('test-file.txt')
    readable.pipe(res)
})


server.listen(8000,'localhost', ()=>{
    console.log("Listening...")
})