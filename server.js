/* eslint-disable no-console */
const http = require('http');
const https = require('https');
const urlUtil = require('url');
const hooks = require('./hooks.json');

const PORT = 3000;

function createCard(message) {
  return JSON.stringify({
    cards: [
      {
        header: {
          title: 'Monitor Alert',
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  content: `${message}`,
                },
              },
            ],
          },
        ],
      },
    ],
  });
}

function sendCard(url, card, callback) {
  const parsedUrl = urlUtil.parse(url);

  const options = {
    host: parsedUrl.host,
    path: parsedUrl.path,
    method: 'POST',
    headers: {
      'Content-Type': 'applicdation/json',
      'Content-Length': card.length,
    },
  };

  const cb = (res) => {
    res.on('error', (error) => {
      console.log(error);
      callback(error, null);
    });

    res.on('end', () => {
      callback(null, res);
    });
  };

  let req;
  if (parsedUrl.protocol === 'http:') {
    req = http.request(options, cb);
  } else {
    req = https.request(options, cb);
  }

  req.write(card);
  req.end();
}

http.createServer((req, res) => {
  let body = [];

  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    const bodyObject = JSON.parse(body);

    const card = createCard(bodyObject.message);
    const { url } = hooks[bodyObject.team];

    const callback = (err, response) => {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      res.writeHead(200);

      if (err) {
        res.end(JSON.stringify({
          error: err,
        }));
      } else {
        res.end(JSON.stringify({
          status: response.statusCode,
          message: response.statusMessage,
        }));
      }
    };

    sendCard(url, card, callback);
  });
}).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
