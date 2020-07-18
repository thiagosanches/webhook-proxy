# webhook-proxy
A small and simple proxy for webhooks. You can use it to centralize the logic of sending message for your rooms on Google Chat using their webhooks. 

The initial idea was to send Zabbix's alerts to all the interested people in their rooms. 

You can use it for any purpose!

## How to use?
```
git clone https://github.com/thiagosanches/webhook-proxy.git
```

## How to configure?
1. Create a spreadsheet in your Google Drive with the following columns. On the example below, every message that was sent to devops team it will also send to Telegram as well.

|teamName|webhookUrl                                    |webhookFallbackUrl               |
|--------|----------------------------------------------|---------------------------------|
|devops  |`https://chat.googleapis.com/v1/spaces/...`   |`https://api.telegram.org/bot...`|
|team1   |`https://chat.googleapis.com/v1/spaces/...`   |`https://api.telegram.org/bot...`|
|team2   |`https://chat.googleapis.com/v1/spaces/...`   |`https://api.telegram.org/bot...`|

2. The webhookFallbackUrl is optional.
3. Create a service account on Google Cloud and download the key json file.
4. Grant permission to the service-account email (your-service-account@your-google-project.iam.gserviceaccount.com) to access your Google Spreadsheet.
5. Edit your key json file and add the spread sheet id and place it on besides `read-google-spreadsheet.js` file, for example:

```json
{
  "type": "service_account",
  "project_id": "your-google-project",
  "private_key_id": "",
  "private_key": "-----BEGIN PRIVATE KEY-----",
  "client_email": "your-service-account@your-google-project.iam.gserviceaccount.com",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...",
  "spread_sheet_id": "<YOUR SPREAD SHEET ID>"
}
```

## How to run?
```
cd webhook-proxy
npm install
node main.js
```
## Run it as a docker container
`docker-compose up -d`

## How to send data?
```
curl http://localhost:3000 -X POST \
--data '{"team":"team1", "message":"Hello!!!"}' -H "Content-Type: application/json"
```

# Kudos
[ariellyparussulo](https://github.com/ariellyparussulo)
[lucasbald](https://github.com/lucasbald)
[rproenca](https://github.com/rproenca)
