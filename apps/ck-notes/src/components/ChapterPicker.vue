<script setup lang="ts">
import type { Chapter } from '../data/types'

defineProps<{
	chapters: Chapter[]
	modelValue: number
	/** 侧边栏弹性换行；默认横向滚动（移动端顶部） */
	wrap?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
</script>

<template>
	<div class="chips" :class="{ 'chips-scroll': !wrap }">
		<button
			v-for="(c, i) in chapters"
			:key="c.day"
			type="button"
			class="chip"
			:class="{ active: modelValue === i }"
			@click="emit('update:modelValue', i)"
		>
			第{{ c.day }}天
		</button>
		<p v-if="chapters.length === 0" class="empty">暂无讲义内容</p>
	</div>
</template>
