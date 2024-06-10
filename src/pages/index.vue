<template>
	<div class="grid grid-cols-12 max-w-6xl gap-4 px-2 md:mx-auto -mt-8">
		<div class="col-span-12">
			<n-alert
				v-if="uptime_error"
				title="错误"
				class="rounded-lg shadow"
				type="error"
			>
				{{ uptime_error?.message }}
			</n-alert>
			<n-alert
				v-if="uptime_loading"
				title="加载中"
				class="rounded-lg shadow"
				type="info"
			>
				请稍后...
			</n-alert>
			<n-alert
				v-if="uptime_data.monitors && allok"
				title="恭喜"
				class="rounded-lg shadow"
				type="success"
			>
				当前服务器都运行正常
			</n-alert>
			<n-alert
				v-if="uptime_data && !allok"
				title="注意"
				class="rounded-lg shadow"
				type="warning"
			>
				当前有服务器宕机，请注意
			</n-alert>
		</div>
		<div class="col-span-12 flex flex-col gap-2 overflow-hidden md:col-span-8">
			<div>
				最新备份状态
				<span class="text-[0.6rem]">——致那些年失去的博客数据 :(</span>
			</div>
			<div
				class="border border-gray-200 rounded-lg bg-white px-6 shadow dark:border-gray-700 dark:bg-gray-800"
			>
				<n-spin v-show="backup_loading" class="min-h-40 w-full"></n-spin>
				<div :show="!backup_loading">
					<div class="grid-4 py-2 divide-y divide-dashed">
						<n-thing
							v-for="(v, k) in backup_data?.backups"
							:key="k"
							class="py-2"
							:title="v.name"
						>
							<template #avatar>
								<n-icon class="i-ic:sharp-settings-backup-restore h-5 w-5" />
							</template>
							<template #header-extra>
								<div class="text-[0.6rem]">
									{{ dayjs(v.end_time).locale('zh-cn').fromNow() }}
								</div>
							</template>
							<template #description>
								<n-space size="small">
									<n-tag
										:type="v.result !== 'Success' ? 'error' : 'success'"
										size="small"
									>
										<template #icon>
											<n-icon
												:class="
													v.result !== 'Success'
														? 'i-material-symbols:error'
														: 'i-clarity:success-standard-solid'
												"
											/>
										</template>
										{{ v.result !== 'Success' ? '备份失败' : '备份成功' }}
									</n-tag>
									<n-tag type="info" size="small">
										{{
											`用时: ${dayjs.duration(dayjs(v.end_time).diff(dayjs(v.begin_time))).asSeconds()}秒`
										}}
										<template #icon>
											<n-icon class="i-material-symbols:alarm" />
										</template>
									</n-tag>
								</n-space>
							</template>
						</n-thing>
					</div>
				</div>
			</div>
			<div
				v-show="uptime_loading"
				class="border border-gray-200 rounded-lg bg-white px-6 shadow dark:border-gray-700 dark:bg-gray-800"
			>
				<n-spin class="min-h-40 w-full"> </n-spin>
			</div>

			<div v-for="(topItem, i) in uptime_data.monitors" :key="i" class="w-full">
				<div>{{ i }}</div>
				<div
					class="mt-2 border border-gray-200 rounded-lg bg-white px-6 shadow dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="w-full divide-y divide-dashed">
						<ul v-for="(item, j) in topItem" :key="j" class="w-full">
							<StatusItem :data="item"></StatusItem>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="col-span-12 flex flex-col gap-2 overflow-hidden md:col-span-4">
			<AboutMe
				:loading="info_loading"
				:data="info_data"
				class="overflow-hidden md:block"
			></AboutMe>
			<div>宕机日志</div>
			<div
				class="border border-gray-200 rounded-lg bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
			>
				<n-spin v-show="uptime_loading" class="min-h-40 w-full"></n-spin>
				<n-timeline>
					<n-timeline-item
						v-for="(item, key) in uptime_data.logs"
						:key="key"
						type="error"
						:title="item.name"
						:time="item.datetime"
					>
						<div class="flex flex-wrap gap-1">
							<n-tag type="error" size="small">
								{{ `${formatDuration(item.duration)} ` }}
								<template #icon>
									<n-icon class="i-material-symbols:alarm" />
								</template>
							</n-tag>
							<n-tag type="info" size="small">
								{{ `原因: ${item.reason.detail}` }}
								<template #icon>
									<n-icon class="i-material-symbols:chat-info" />
								</template>
							</n-tag>
						</div>
					</n-timeline-item>
				</n-timeline>
			</div>

			<div>备份失败日志</div>
			<div
				class="border border-gray-200 rounded-lg bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
			>
				<n-spin v-show="backup_loading" class="min-h-40 w-full"></n-spin>
				<n-timeline>
					<n-timeline-item
						v-for="(item, key) in backup_data?.errors"
						:key="key"
						type="error"
						:title="item.name + '失败 :('"
						:time="dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss')"
					>
						<div class="flex flex-wrap gap-1">
							<n-tag type="error" size="small">
								{{
									formatDuration(
										dayjs(item.end_time).unix() - dayjs(item.begin_time).unix(),
									)
								}}
								<template #icon>
									<n-icon class="i-material-symbols:alarm" />
								</template>
							</n-tag>
							<n-tag type="info" size="small">
								{{ `${item.operate} ${item.result}` }}
								<template #icon>
									<n-icon class="i-material-symbols:chat-info" />
								</template>
							</n-tag>
						</div>
					</n-timeline-item>
				</n-timeline>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
const {
	loading: uptime_loading,
	data: uptime_data,
	error: uptime_error,
} = uptimeRequest('', 90)
const { loading: backup_loading, data: backup_data } = backupRequest()
const { loading: info_loading, data: info_data } = infoRequest()
const allok = computed(() => {
	let ok = true
	console.log(uptime_data.value)
	for (const key in uptime_data.value?.monitors) {
		// eslint-disable-next-line no-unsafe-optional-chaining
		for (const item of uptime_data.value?.monitors[key]) {
			if (item.status === 'down') {
				ok = false
			}
		}
	}
	return ok
})
</script>
