const fetch = require('node-fetch')
const dispatcher = require('./dispatcher')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

function createCard(message){
  return JSON.stringify({
    "cards": [
      {
        "header": {
          "title": "Monitor Alert",
        },
        "sections": [
          {
            "widgets": [
                {
                  "keyValue": {
                    "content": `${message}`
                    }
                }
            ]
          },
        ]
      }
    ]
  })
}

app.use(bodyParser.json())

app.post('/', async (req, res) => {
  const body = req.body
  try {
    const webhooks = dispatcher
    const data = await fetch(webhooks[body.team].webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: createCard(body.message),
    })
    res.sendStatus(data.status)

    if(webhooks[body.team].webhookFallbackUrl){
      const data = await fetch(`${webhooks[body.team].webhookFallbackUrl}${encodeURIComponent(body.message)}`, {
        method: 'GET',
      })
    }
  } catch (e) {
    console.log(e)
  }
})

app.listen(3000, function () {
  console.log('Message Dispatcher Listening!')
})
