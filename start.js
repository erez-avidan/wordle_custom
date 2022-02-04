const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/definition/:word', (req, res) => {
    request(
        {
            url: `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${req.params.word}?fields=definitions%2Cpronunciations&strictMatch=true`,
            headers: {
                "Accept": "application/json",
                "app_id": "2f7156ba",
                "app_key": "ff1f8177ca3decb8e986f817cc54ca11"
            },
            method: 'GET'
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error?.message });
            }

            var definition = null;
            var pronunciations = null;
            const data = JSON.parse(body);
            if (data != null && data.results != null && data.results.length > 0 &&
                data.results[0].lexicalEntries != null && data.results[0].lexicalEntries.length > 0 &&
                data.results[0].lexicalEntries[0].entries != null && data.results[0].lexicalEntries[0].entries.length > 0) {

                definition = data.results[0].lexicalEntries[0].entries.filter( entry => entry.senses != null && entry.senses.length > 0 &&
                    entry.senses[0].definitions != null && entry.senses[0].definitions.length > 0).map(entry => entry.senses[0].definitions[0]);

                if(data.results[0].lexicalEntries[0].entries[0].pronunciations != null && data.results[0].lexicalEntries[0].entries[0].pronunciations.length > 0) {
                    pronunciations = data.results[0].lexicalEntries[0].entries[0].pronunciations.filter(p => p.audioFile != null).map(p => p.audioFile).shift();
                }
            }

            res.json([definition, pronunciations]);
        }
    )
});

app.use('/public', express.static('public'))

app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));