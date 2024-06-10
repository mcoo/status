import { useRequest } from 'vue-request'

export interface IInfo {
	name: string
	avatar: string
	desc: string
	footer: string
}

export const infoRequest = () => {
	const { data, loading, error } = useRequest<IInfo>(() =>
		http.get('/api/info'),
	)
	return { data, loading, error }
}
