/* eslint-disable no-console */
const http = require('http');
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

function sendCard(domain, path, card, callback) {
  const options = {
    host: domain,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'applicdation/json',
      'Content-Length': card.length,
    },
  };

  const cb = (res) => {
    let body = '';

    res.on('error', (error) => {
      console.log(error);
      callback(error, null);
    });

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      callback(null, { res, body });
    });
  };

  const req = http.request(options, cb);
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
    const { domain } = hooks[bodyObject.team];
    const { path } = hooks[bodyObject.team];

    const callback = (err, data) => {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      res.writeHead(200);

      if (err) {
        res.end(JSON.stringify({
          error: err,
        }));
      } else {
        res.end(JSON.stringify({
          status: data.res.statusCode,
          message: data.res.statusMessage,
          body: data.body,
        }));
      }
    };

    sendCard(domain, path, card, callback);
  });
}).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
