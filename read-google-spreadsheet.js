const { GoogleSpreadsheet } = require('google-spreadsheet')
const key = require('./key.json')

const doc = new GoogleSpreadsheet(key.spread_sheet_id)

module.exports =  async () => {
	let webhookObj = {}

	await doc.useServiceAccountAuth({
		client_email: key.client_email,
		private_key: key.private_key,
	})

	await doc.loadInfo()
	const sheet = doc.sheetsByIndex[0]

	console.log(`Getting information from ${sheet.title} workspace...`)

	const rows = await sheet.getRows()

	for (const row of rows) {
		const { teamName, webhookUrl, webhookFallbackUrl } = row

		console.log('teamName', teamName)
		console.log('webhookUrl', webhookUrl)
		console.log('webhookFallbackUrl', webhookFallbackUrl)

		webhookObj[teamName] = { webhookUrl, webhookFallbackUrl }
	}

	console.log('webhookObj', webhookObj)
	return webhookObj
}