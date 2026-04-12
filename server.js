const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const PUTANJA_JSON = path.join(__dirname, 'data', 'projekcije.json');

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/sala.html');
});

app.get('/api/projekcije', (req, res) => {
    const podaci = fs.readFileSync(PUTANJA_JSON, 'utf-8');
    res.json(JSON.parse(podaci));
});

app.post('/api/projekcije', (req, res) => {
    fs.writeFileSync(PUTANJA_JSON, JSON.stringify(req.body, null, 4), 'utf-8');
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log('Server pokrenut na http://localhost:' + PORT);
});
