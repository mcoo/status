export function formatDuration(seconds: any) {
	let s = parseInt(seconds)
	let m = 0
	let h = 0
	if (s >= 60) {
		m = parseInt((s / 60) as unknown as string)
		s = parseInt((s % 60) as unknown as string)
		if (m >= 60) {
			h = parseInt((m / 60) as unknown as string)
			m = parseInt((m % 60) as unknown as string)
		}
	}
	let text = `${s} 秒`
	if (m > 0) text = `${m} 分 ${text}`
	if (h > 0) text = `${h} 小时 ${text}`
	return text
}
