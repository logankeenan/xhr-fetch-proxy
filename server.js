const express = require('express')
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/post-data', function (req, res) {
    const receivedData = req.body;
    res.json({receivedData});
});

app.get('/redirect', function (req, res) {
    res.redirect(302, '/redirect-target');
});

app.get('/redirect-target', function (req, res) {
    res.json({redirected: true, message: 'Redirect successful'});
});

app.get('/html', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.send('<html><body><h1>Hello, World!</h1></body></html>');
});

app.get('/slow-response', function (req, res) {
    setTimeout(() => res.json({message: 'Slow response'}), 3000);
});

app.get('/echo-headers', function (req, res) {
    res.json(req.headers);
});

app.get('/blob-data', function (req, res) {
    const buffer = Buffer.from('Hello, World!', 'utf-8');
    res.type('application/octet-stream');
    res.send(buffer);
});

app.get('/multiple-headers', function (req, res) {
    res.set('Access-Control-Expose-Headers', 'X-Custom-Header');
    res.set('X-Custom-Header', 'CustomValue');
    res.json({message: 'Multiple headers set'});
});

app.get('/xml-as-plain', function (req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('<root><child>Content</child></root>');
});


app.listen(3000)