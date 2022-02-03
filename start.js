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
            url: `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${req.params.word}?fields=definitions&strictMatch=false`,
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

            const data = JSON.parse(body);
            const definitions = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions;

            res.json(definitions);
        }
    )
});

app.use(express.static('www'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));