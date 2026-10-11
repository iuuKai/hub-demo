<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ src: string }>()

// 内容 HTML 是带完整 head 的独立页面（含 MathJax 与自带样式），
// 用 iframe 渲染可保持原页面样式与公式渲染完全一致。
const url = computed(() => props.src)
</script>

<template>
	<div class="html-viewer">
		<iframe :src="url" class="html-frame" title="学习资料" />
	</div>
</template>

<style scoped>
.html-viewer {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.html-frame {
	flex: 1;
	min-height: 0;
	width: 100%;
	border: 0;
	border-radius: var(--radius);
	background: #fff;
	box-shadow: var(--shadow);
}
</style>
