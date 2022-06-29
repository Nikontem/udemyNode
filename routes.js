const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html lang="en">');
        res.write("<head><title>Node S Server</title></head>");
        res.write("<body><form action='/messages' method='POST'><input name='message' type='text'><button type='submit'>Send</button></form></body>")
        res.write('</html>');
        return res.end();
    }

    if (url === '/messages' && method === 'POST') {
        const body = []
        req.on('data', (dataChunk) => {
            body.push(dataChunk);
            console.log(dataChunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString().replaceAll("+", " ");
            fs.writeFile('message.txt', parsedBody.split('=')[1], () => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });

    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html lang="en">');
    res.write("<head><title>My Fire Page</title></head>");
    res.write("<body><h1>Hello from my Node.js Server!</h1></body>")
    res.write('</html>');
    res.end();
}

module.exports = requestHandler;