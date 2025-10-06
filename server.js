const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const outputDir = '_site';
const pathPrefix = '/website';

const server = http.createServer((req, res) => {
    // Remove the path prefix from the request URL
    let url = req.url;
    if (url.startsWith(pathPrefix)) {
        url = url.substring(pathPrefix.length);
    }

    let filePath = path.join(__dirname, outputDir, url === '/' ? 'index.html' : url);

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch(extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            // If file not found, try to append .html
            if (err.code === 'ENOENT' && !extname) {
                fs.readFile(filePath + '.html', (err2, content2) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Página no encontrada</h1>');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content2);
                    }
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Página no encontrada</h1>');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Abre tu navegador en http://localhost:${port}/website/blog.html`);
});
