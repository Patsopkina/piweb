const express = require('express');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const app = express();
const PORT = 3000;

const TXT_FILE = path.join(__dirname, 'data.txt');
const XML_FILE = path.join(__dirname, 'data.xml');

function initFiles() {
    if (!fs.existsSync(TXT_FILE)) {
        fs.writeFileSync(TXT_FILE, '');
        console.log('Создан файл', TXT_FILE);
    }
    if (!fs.existsSync(XML_FILE)) {
        fs.writeFileSync(XML_FILE, '<forms/>');
        console.log('Создан файл', XML_FILE);
    }
}

initFiles();

app.use(express.static(__dirname));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save-data', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Форма получена:', formData);

        fs.appendFileSync(TXT_FILE, `${Object.values(formData).join('|')}\n`);

        const xmlString = fs.readFileSync(XML_FILE, 'utf8');
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlString);

        if (!result.forms) result.forms = {};
        if (!result.forms.form) result.forms.form = [];
        const xmlReadyObject = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, [value]])
        );

        result.forms.form.push(xmlReadyObject);

        const builder = new xml2js.Builder({
            xmldec: { version: '1.0', encoding: 'UTF-8' },
            renderOpts: { pretty: true, indent: '  ', newline: '\n' }
        });
        const updatedXml = builder.buildObject(result);

        fs.writeFileSync(XML_FILE, updatedXml);

        res.json({ success: true, message: 'Данные сохранены в TXT и XML' });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/get-txt', (req, res) => {
    try {
        const txtData = fs.readFileSync(TXT_FILE, 'utf8');
        res.type('text/plain').send(txtData);
    } catch (error) {
        res.status(500).type('text/plain').send(`Ошибка: ${error.message}`);
    }
});
app.get('/get-xml', (req, res) => {
    try {
        const xmlData = fs.readFileSync(XML_FILE, 'utf8');
        res.type('application/xml').send(xmlData);
    } catch (error) {
        res.status(500).type('text/plain').send(`Ошибка: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});