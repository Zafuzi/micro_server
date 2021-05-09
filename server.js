const http = require('http');
const PORT = process.argv[2] || 12345;
http.createServer(require('./index.js')).listen(PORT, () => {
    console.log( `\n\n--------------------Listening on port ${PORT}--------------------\n\n`);
});
