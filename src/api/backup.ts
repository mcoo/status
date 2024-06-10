import { useRequest } from 'vue-request'

interface IResult {
	backups: { [key: string]: IBackupInfo }
	errors: IBackupInfo[]
}

export interface IBackupInfo {
	name: string
	operate: string
	result: string
	begin_time: string
	end_time: string
	duration: string
}

export const backupRequest = () => {
	const { data, loading, error } = useRequest<IResult>(() =>
		http.get('/api/backup/get'),
	)
	return { data, loading, error }
}
