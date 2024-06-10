<!-- eslint-disable vue/no-v-html -->
<template>
	<div
		class="relative hidden border border-gray-200 rounded-lg bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
	>
		<n-spin v-show="loading" class="min-h-40 w-full"></n-spin>
		<n-thing v-show="!loading">
			<template #avatar>
				<n-avatar round bordered :src="data?.avatar"> </n-avatar>
			</template>
			<template #header>{{ data?.name }}</template>
			<template #description>
				<div class="text-wrap text-[0.6rem]" v-html="data?.desc"></div>
			</template>
			<div
				class="i-mdi:chat-processing absolute h-32 w-32 rotate-45 -right-10 -top-5 dark:text-white"
			></div>
		</n-thing>
	</div>
</template>
<script setup lang="ts">
import type { IInfo } from '~/api/info'

interface Props {
	loading: boolean
	data?: IInfo
}
defineProps<Props>()
</script>
