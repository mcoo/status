<template>
	<li class="flex items-center py-5 space-x-2">
		<i
			v-if="data.opts['国家']"
			class="flex-shrink-1"
			:class="'fi fi-' + data.opts['国家']"
		></i>
		<div class="flex grow-1 flex-col overflow-x-hidden space-y-0.5">
			<div class="flex justify-between">
				<div class="text-[0.8rem]">
					{{ data?.name }}
				</div>
				<n-tag
					round
					class="bg-transparent"
					:bordered="false"
					:type="data?.status !== 'ok' ? 'error' : 'success'"
					size="small"
				>
					<template #icon>
						<n-icon
							:class="
								data?.status !== 'ok'
									? 'i-material-symbols:error'
									: 'i-clarity:success-standard-solid'
							"
						/>
					</template>
					{{ status[data?.status] }}
				</n-tag>
			</div>
			<div class="w-full flex space-x-0.2 md:space-x-0.5">
				<n-tooltip
					v-for="(item, index) in data?.daily"
					:key="index"
					placement="top"
					display-directive="show"
					:flip="false"
					:delay="0"
					:animated="false"
					:arrow-point-to-center="true"
					:duration="0"
					trigger="hover"
				>
					<template #trigger>
						<i
							class="h-5 flex-grow-1 rounded-1 hover:scale-y-110"
							:class="
								parseFloat(item.uptime) >= 100
									? 'bg-green-400 hover:bg-green-500'
									: item.down.times <= 0
										? 'bg-gray-400 hover:hover:bg-gray-500'
										: parseFloat(item.uptime) <= 50
											? 'bg-red-400 hover:bg-red-500'
											: 'bg-yellow-400 hover:bg-yellow-500'
							"
						></i>
					</template>
					{{ item.date.format('YYYY-MM-DD') }}
				</n-tooltip>
			</div>
			<div class="flex justify-between text-[0.6rem] text-gray-400 font-thin">
				<div>今日</div>
				<div>
					{{
						data?.total?.times
							? `最近 90 天故障 ${data?.total?.times} 次，累计 ${formatDuration(data?.total?.duration)}，平均可用率 ${data?.average}%`
							: `最近 90 天可用率 ${data?.average}%`
					}}
				</div>
				<div>
					{{ data?.daily[data?.daily.length - 1].date.format('YYYY-MM-DD') }}
				</div>
			</div>
			<div class="mt-0 flex flex-wrap gap-0.5">
				<n-tag
					v-for="(v, i) in data?.opts['标签']?.split(',')"
					:key="i"
					:type="v.split('|')[0] as any"
					class="m-0"
					size="small"
					round
				>
					{{ v.split('|')[1] }}
				</n-tag>
			</div>
		</div>
	</li>
</template>
<script setup lang="ts">
import { _Result } from '../api/uptime'
interface Props {
	data: _Result
}
const status: { [key: string]: string } = {
	ok: '正常',
	down: '无法访问',
	unknow: '未知',
}

defineProps<Props>()
</script>
