function addHeaders(response) {
	response.headers.set('Access-Control-Allow-Origin', '*')
	response.headers.set('Access-Control-Allow-Credentials', 'true')
	response.headers.set(
		'Access-Control-Allow-Methods',
		'GET,HEAD,OPTIONS,POST,PUT',
	)
	response.headers.set(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	)
}
export default {
	async fetch(request, env) {
		const url = new URL(request.url)
		if (url.pathname.startsWith('/api/backup/get')) {
			let response
			if (request.method == 'OPTIONS') {
				response = new Response('')
				addHeaders(response)
				return response
			}
			response = new Response(
				JSON.stringify({
					backups: JSON.parse(await env.STATUS.get('backup')),
					errors: JSON.parse(await env.STATUS.get('errors')),
				}),
				{ headers: { 'Content-Type': 'application/json' } },
			)
			addHeaders(response)
			return response
		}
		if (url.pathname.startsWith('/api/info')) {
			let info = JSON.parse(env.INFO)
			let response
			if (request.method == 'OPTIONS') {
				response = new Response('')
				addHeaders(response)
				return response
			}
			response = new Response(JSON.stringify(info), {
				headers: { 'Content-Type': 'application/json' },
			})
			addHeaders(response)
			return response
		}
		if (url.pathname.startsWith('/api/backup')) {
			if (url.searchParams.get('token') !== env.BACKUP_HTTP_TOKEN) {
				let response = new Response('token error')
				return response
			}
			let body = await request.json()
			if (body.Extra['OperationName'] !== 'Backup') {
				let response = new Response('ok')
				return response
			}
			let result = {
				name: body.Extra['backup-name'],
				operate: body.Extra['OperationName'],
				result: body.Data['ParsedResult'],
				begin_time: body.Data['BeginTime'],
				end_time: body.Data['EndTime'],
				duration: body.Data['Duration'],
			}
			let backup = JSON.parse(await env.STATUS.get('backup'))
			backup[result.name] = result
			await env.STATUS.put('backup', JSON.stringify(backup))
			if (result.result !== 'Success') {
				let errors = JSON.parse(await env.STATUS.get('errors'))
				errors.push(result)
				await env.STATUS.put('errors', JSON.stringify(errors))
			}
			let response = new Response('ok')
			return response
		}
		if (url.pathname.startsWith('/api')) {
			let response
			if (request.method == 'OPTIONS') {
				response = new Response('')
				addHeaders(response)
				return response
			}
			let body = await request.json()
			body['api_key'] = env.TOKEN
			response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
				method: 'post',
				headers: request.headers,
				redirect: 'follow',
				body: JSON.stringify(body),
				cf: {
					cacheTtl: 60,
					cacheEverything: true,
				},
			})
			let resp = await response.json()
			resp['monitors'] = resp['monitors'].map((monitor) => {
				// eslint-disable-next-line no-unused-vars
				const { id, url, port, ...newMonitor } = monitor
				return newMonitor
			})

			response = new Response(JSON.stringify(resp), response)
			addHeaders(response)
			return response
		}
		// Otherwise, serve the static assets.
		// Without this, the Worker will error and no assets will be served.
		return env.ASSETS.fetch(request)
	},
}
