const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DB_PATH = path.join(__dirname, 'database.json');
const APP_BASE_PATH = path.join(__dirname, '..'); // The 'flowapp_v2' directory

// Helper to read/write the JSON database file
const readDb = (callback) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            // If the file doesn't exist, start with an empty object
            if (err.code === 'ENOENT') {
                return callback(null, {});
            }
            return callback(err);
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            callback(parseErr);
        }
    });
};

const writeDb = (data, callback) => {
    fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8', callback);
};

// Request Handler
const server = http.createServer((req, res) => {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight CORS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const { method, url } = req;
    console.log(`Request: ${method} ${url}`);

    // API: Get scores for a nickname
    if (method === 'GET' && url.startsWith('/scores/')) {
        const nickname = url.split('/')[2];
        readDb((err, db) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read database' }));
                return;
            }
            const userScores = db[nickname] || {};
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userScores));
        });
    }
    // API: Post a new score
    else if (method === 'POST' && url === '/scores') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { nickname, gameId, score } = JSON.parse(body);
                if (!nickname || gameId === undefined || score === undefined) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                readDb((err, db) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to read database' }));
                        return;
                    }

                    if (!db[nickname]) {
                        db[nickname] = {};
                    }

                    const existingScore = db[nickname][gameId] || 0;
                    if (score > existingScore) {
                        db[nickname][gameId] = score;
                    }

                    writeDb(db, (writeErr) => {
                        if (writeErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to write to database' }));
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Score processed successfully' }));
                    });
                });
            } catch (parseErr) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    // Static File Serving
    else if (method === 'GET') {
        let filePath = url === '/' ? '/index.html' : url;
        const fullPath = path.join(APP_BASE_PATH, filePath);

        // Prevent directory traversal attacks
        if (!fullPath.startsWith(APP_BASE_PATH)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        const extname = String(path.extname(fullPath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(fullPath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    // If file not found, try serving index.html for SPA routing
                    fs.readFile(path.join(APP_BASE_PATH, 'index.html'), (indexErr, indexContent) => {
                        if (indexErr) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('404 Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(indexContent, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
    // Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Initialize DB file if it doesn't exist
readDb((err, data) => {
    if (err) {
        console.error('Failed to initialize database:', err);
        return;
    }
    if (Object.keys(data).length === 0) {
        writeDb({}, (writeErr) => {
            if (writeErr) console.error('Failed to create empty database file:', writeErr);
            else console.log('Empty database file created.');
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${APP_BASE_PATH}`);
    console.log(`Database file at: ${DB_PATH}`);
});