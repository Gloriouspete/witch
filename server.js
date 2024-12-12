const express = require('express');
const path = require('path');
const app = express();

// Set proper MIME types for JavaScript modules
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript; charset=utf-8');
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    next();
});

// Serve static files from the current directory
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    }
}));

// Handle all routes by serving the appropriate HTML file
app.get('*', (req, res) => {
    const url = req.url;
    if (url.includes('dungeon')) {
        res.sendFile(path.join(__dirname, 'dungeon.html'));
    } else if (url.includes('interior')) {
        res.sendFile(path.join(__dirname, 'interior.html'));
    } else if (url.includes('exterior')) {
        res.sendFile(path.join(__dirname, 'exterior.html'));
    } else if (url.includes('alchemy')) {
        res.sendFile(path.join(__dirname, 'alchemy.html'));
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
