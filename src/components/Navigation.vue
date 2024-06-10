<script setup lang="ts">
import { getRoutes } from '@/plugins/router'
import { SwitchIcon } from 'vue-dark-switch'

const { te, t } = useI18n()

const routes = getRoutes()
	.filter((r) => !r.path.includes('notFound'))
	.map((r) => {
		let { path, name } = r
		if (path === safeResolve('/')) {
			return { path, name: 'home' }
		}

		if (!name) {
			name = path
		}

		return { path, name: name.toString().slice(1).replaceAll('/', ' · ') }
	})

const $route = useRoute()
</script>

<template>
	<nav
		aria-label="Site Nav"
		class="flex items-center justify-center bg-black p-4 pb-15 text-light-50"
	>
		<div class="max-w-6xl w-full flex justify-between px-2">
			<div class="flex items-center justify-center space-x-5">
				<SwitchIcon unmount-persets class="text-light-50" />
				<div class="text-md font-bold font-sans">
					{{ TITLE }}
				</div>
			</div>
			<ul class="flex items-center gap-2 text-sm font-medium">
				<li v-for="r of routes" :key="r.path" class="hidden !block">
					<RouterLink
						class="rounded-lg px-3 py-2 hover:text-gray-200"
						:class="$route.path === r.path ? 'text-gray-100' : ''"
						:to="r.path"
					>
						{{ te(r.name) ? t(r.name) : r.name }}
					</RouterLink>
				</li>
				<a
					class="i-mdi:github cursor-pointer text-2xl hover:text-gray-1"
					href="https://github.com/mcoo/status"
				></a>
			</ul>
		</div>
	</nav>
</template>
