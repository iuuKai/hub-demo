<script setup lang="ts">
import { computed } from 'vue'
import { store, currentDoc } from '../composables/useNotesStore'
import HtmlViewer from './HtmlViewer.vue'

const src = computed(() => (currentDoc.value ? `${import.meta.env.BASE_URL}${currentDoc.value}` : ''))
</script>

<template>
	<div class="doc-view">
		<div class="doc-head">
			<span class="doc-name">
				{{ store.feature === 'mistakes' ? '错题集' : '考试大纲' }} · {{ store.subject }}
			</span>
		</div>
		<HtmlViewer v-if="src" :key="`${store.feature}-${store.subject}`" :src="src" />
		<p v-else class="empty">该科目暂无{{ store.feature === 'mistakes' ? '错题集' : '考试大纲' }}内容</p>
	</div>
</template>

<style scoped>
.doc-view {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.doc-head {
	padding: 2px 0 10px;
}

.doc-name {
	font-size: 14px;
	font-weight: 600;
	color: var(--text);
}

.doc-view :deep(.html-viewer) {
	flex: 1;
	min-height: 0;
}
</style>
