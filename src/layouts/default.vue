<template>
	<div class="relative m-0 h-screen w-full flex flex-col p-0">
		<Navigation />
		<div class="flex-grow">
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
		<n-float-button :right="10" :bottom="10" type="primary" @click="OpenMail">
			<i class="i-material-symbols:alternate-email"></i>
		</n-float-button>
		<div
			class="text-[1.1rem]] mt-3 text-center text-gray-500 dark:text-gray-300"
		>
			<n-a href="https://status.mcenjoy.cn">STATUS</n-a>
		</div>
	</div>
</template>
<script setup lang="ts">
function OpenMail() {
	window.open('mailto:i@mcenjoy.cn', '_blank')
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
