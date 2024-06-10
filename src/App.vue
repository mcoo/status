<template>
	<n-config-provider :theme="naiveTheme" class="select-none">
		<router-view />
	</n-config-provider>
</template>
<script setup>
import { naiveTheme } from 'vue-dark-switch'
</script>
<style>
/* a {
	color: rgba(37, 99, 235);
} */
/* body {
	padding: 0;
	margin: 0;
}
p {
	padding: 0 10px;
} */
</style>
