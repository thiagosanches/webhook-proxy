# webhook-proxy
A small and simple proxy for webhooks. You can use it to centralize the logic of sending message for your rooms on Google Chat using their webhooks. 

The initial idea was to send Zabbix's alerts to all the interested people in their rooms/channels. 

You can use it for any purpose!

## How to use?
```
git clone https://github.com/thiagosanches/webhook-proxy.git
cd webhook-proxy
npm install
node main.js
```
## Run it as a docker container
`docker-compose up -d`

## How to configure?
Update the `dispatcher.json` file according to your needs. There are only two properties: `team` and `webhook`. Example:

```
{
    "team1":{
        "webhookUrl": "https://<Google Chat's Webhook URL 1>"
    },
    "team2":{
        "webhookUrl": "https://<Google Chat's Webhook URL 2>"
    }
}
```

## How to send data?
```
curl http://localhost:3000 -X POST \
--data '{"team":"team1", "message":"Hello!!!"}' -H "Content-Type: application/json"
```
