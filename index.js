const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3001;

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

const server = http.createServer((req, res) => {

        var uri = url.parse(req.url).pathname;
        var fileName = path.join(process.cwd(), unescape(uri));
        var stats;

        console.log("Loading = "+uri);

        try{
            stats = fs.lstatSync(fileName);
        } catch (e){
            res.writeHead (404,
                {
                    'Content-Type': 'text/plain'
                });
            res.write(`404 Not found`);
            res.end();
            return;

        }
        if (stats.isFile()){
            var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
            res.writeHead(200, mimeType);
            var fileStream = fs.createReadStream(fileName);
            fileStream.pipe(res);
            //res.end();
        } else if (stats.isDirectory()){
            res.writeHead(302,
                {
                    'Location' : 'index.html'
                });
            res.end();
        } else {
            res.writeHead (500, {
                'Content-type': 'text/plain'
            });
            res.end();
        }

    }
);

server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}`);
});