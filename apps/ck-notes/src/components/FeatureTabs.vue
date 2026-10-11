<script setup lang="ts">
import type { FeatureId } from '../data/types'

defineProps<{
	modelValue: FeatureId
	vertical?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: FeatureId): void }>()

const TABS: { id: FeatureId; label: string; hint: string }[] = [
	{ id: 'classes', label: '讲义', hint: '每日课程' },
	{ id: 'mistakes', label: '错题集', hint: '错题回顾' },
	{ id: 'outlines', label: '考试大纲', hint: '考纲要点' }
]
</script>

<template>
	<div class="tabs" :class="{ vertical }">
		<button
			v-for="t in TABS"
			:key="t.id"
			type="button"
			class="tab"
			:class="{ active: modelValue === t.id }"
			@click="emit('update:modelValue', t.id)"
		>
			<span class="tab-label">{{ t.label }}</span>
			<span v-if="vertical" class="tab-hint">{{ t.hint }}</span>
		</button>
	</div>
</template>

<style scoped>
.tabs {
	display: flex;
	gap: 6px;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: space-around;
}

.tabs.vertical {
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	gap: 6px;
}

.tab {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1px;
	padding: 8px 6px;
	border-radius: 10px;
	font-size: 13px;
	color: var(--muted);
	transition: all 0.15s ease;
	min-width: 0;
	flex: 1;
}

.tabs.vertical .tab {
	flex: none;
	flex-direction: row;
	justify-content: flex-start;
	gap: 10px;
	padding: 10px 14px;
}

.tab:hover {
	color: var(--brand);
	background: var(--brand-weak);
}

.tab.active {
	color: var(--brand);
	background: var(--brand-weak);
	font-weight: 600;
}

.tab-label {
	white-space: nowrap;
}

.tab-hint {
	font-size: 11px;
	color: var(--muted);
	opacity: 0.75;
}

.tab.active .tab-hint {
	color: var(--brand);
	opacity: 0.8;
}
</style>
