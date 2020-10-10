const Server = require('./server');

const server = new Server;

server.listen(port => {
    console.log(`Server is listening on http://localhost:${port}`);
});