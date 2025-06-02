const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sorted', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorted.html'));
});

app.get('/api/array', (req, res) => {
    const array = Array.from({length: 100}, () => Math.floor(Math.random() * 51) + 10);
    res.json({
        original: array,
        sorted: [...array].sort((a, b) => a - b),
        min: Math.min(...array)
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});