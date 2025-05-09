require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

const shortenedURLs = new Map();

const isValidUrl = urlString=> {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  }
  catch(e){ 
    return false; 
  }
}

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const urlString = req.body.url;
  // console.log('urlString', urlString);
  // console.log('isValidUrl', isValidUrl(urlString));
  if(isValidUrl(urlString)) {
    if(!shortenedURLs.has(urlString)){
      const shortURL = shortenedURLs.size + 1;
      shortenedURLs.set(shortURL, urlString);
      res.status(201).json({original_url: urlString, short_url: shortURL});
    }
  } else {
    res.status(201).json({error: 'invalid url'});
  }
});

app.get('/api/shorturl/:short', function(req, res) {
  const originalURL = shortenedURLs.get(parseInt(req.params.short));
  res.redirect(301, originalURL);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
