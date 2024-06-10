import { useRequest } from 'vue-request'
export interface _Result {
	id: number
	name: string
	url: string
	average: string
	daily: {
		date: any
		uptime: string
		down: {
			times: number
			duration: number
		}
	}[]
	total: {
		times: number
		duration: number
	}
	status: string
	opts: { [key: string]: string }
}
export type _Resp = {
	stat: string
	pagination: {
		offset: number
		limit: number
		total: number
	}
	monitors: Array<{
		id: number
		friendly_name: string
		url: string
		custom_uptime_ranges: string
		type: number
		sub_type: string
		keyword_type?: number
		keyword_case_type?: number
		keyword_value: string
		port: any
		interval: number
		timeout: number
		status: number
		create_datetime: number
		logs: Array<{
			id: number
			type: number
			datetime: number
			duration: number
			reason: {
				code: string
				detail: string
			}
		}>
		lastLogTypeBeforeStartDate: {}
	}>
}
function formatNumber(value: any) {
	return (Math.floor(value * 100) / 100).toString()
}
const reg = /\$\{(.+?):(.+?)\}/gm
export const uptimeRequest = (apikey: string, days: number) => {
	const today = dayjs(new Date().setHours(0, 0, 0, 0))
	const dates = [] as any[]
	for (let d = 0; d < days; d++) {
		dates.push(today.subtract(d, 'day'))
	}
	const ranges = dates.map(
		(date) => `${date.unix()}_${date.add(1, 'day').unix()}`,
	)
	const start = dates[dates.length - 1].unix()
	const end = dates[0].add(1, 'day').unix()
	ranges.push(`${start}_${end}`)
	const postdata = {
		api_key: apikey,
		format: 'json',
		logs: 1,
		log_types: '1-2',
		logs_start_date: start,
		logs_end_date: end,
		custom_uptime_ranges: ranges.join('-'),
	}
	const {
		data: rawData,
		loading,
		error,
	} = useRequest<_Resp>(() => http.post('/api', postdata))
	const data = computed(() => {
		console.log(rawData.value)
		return {
			monitors: rawData.value?.monitors
				.map((monitor) => {
					const ranges = monitor.custom_uptime_ranges.split('-')
					const average = formatNumber(ranges.pop())
					const daily = new Array<{
						date: any
						uptime: string
						down: { times: number; duration: number }
					}>()
					const map = new Array()
					dates.forEach((date, index) => {
						map[date.format('YYYYMMDD')] = index
						daily[index] = {
							date: date,
							uptime: formatNumber(ranges[index]),
							down: { times: 0, duration: 0 },
						}
					})
					const total = monitor.logs.reduce(
						(total, log) => {
							if (log.type === 1) {
								const date = parseInt(
									dayjs.unix(log.datetime).format('YYYYMMDD'),
								)
								total.duration += log.duration
								total.times += 1
								daily[map[date]].down.duration += log.duration
								daily[map[date]].down.times += 1
							}
							return total
						},
						{ times: 0, duration: 0 },
					)

					const result: _Result = {
						id: monitor.id,
						name: monitor.friendly_name,
						url: monitor.url,
						average: average,
						daily: daily,
						total: total,
						status: 'unknow',
						opts: {},
					}

					let match

					while ((match = reg.exec(result.name)) !== null) {
						result.opts[match[1]] = match[2]
					}
					result.name = result.name.replaceAll(reg, '')
					if (monitor.status === 2) result.status = 'ok'
					if (monitor.status === 9) result.status = 'down'
					return result
				})
				.reduce(
					(obj: { [key: string]: _Result[] }, item) => {
						const key = item.opts['类别'] as string
						if (key) {
							if (!Object.prototype.hasOwnProperty.call(obj, key)) {
								obj[key] = []
							}
							obj[key].push(item)
						} else {
							if (!Object.prototype.hasOwnProperty.call(obj, '未分类')) {
								obj['未分类'] = []
							}
							obj['未分类'].push(item)
						}
						return obj
					},
					{} as { [key: string]: _Result[] },
				),
			logs: rawData.value?.monitors
				.reduce(
					(logs, monitor) => {
						monitor.logs.forEach((item) => {
							if (item.type === 1) {
								logs.push({
									name: monitor.friendly_name.replaceAll(reg, ''),
									datetime: dayjs
										.unix(item.datetime)
										.format('YYYY-MM-DD HH:mm:ss'),
									duration: item.duration,
									reason: {
										code: item.reason.code,
										detail: item.reason.detail,
									},
								})
							}
						})
						return logs
					},
					[] as {
						name: string
						datetime: any
						duration: any
						reason: {
							code: string
							detail: string
						}
					}[],
				)
				.sort((a, b) => {
					return b.datetime - a.datetime
				}),
		}
	})
	return { data, loading, error }
}
