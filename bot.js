const fetch = require('node-fetch')
const dispatcher = require('./dispatcher.json')

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
    const data = await fetch(dispatcher[body.team].webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: createCard(body.message),
    })
    res.sendStatus(data.status)
  } catch (e) {
    console.log(e)
  }
})

app.listen(3000, function () {
  console.log('Message Dispatcher Listening!')
})
