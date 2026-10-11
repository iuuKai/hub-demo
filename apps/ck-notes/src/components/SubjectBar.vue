<script setup lang="ts">
import { SUBJECTS } from '../data/types'
import type { SubjectId } from '../data/types'

defineProps<{
	modelValue: SubjectId
	/** 侧边栏弹性换行；默认横向滚动（移动端顶部） */
	wrap?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: SubjectId): void }>()
</script>

<template>
	<div class="chips" :class="{ 'chips-scroll': !wrap }">
		<button
			v-for="s in SUBJECTS"
			:key="s.id"
			type="button"
			class="chip"
			:class="{ active: modelValue === s.id }"
			@click="emit('update:modelValue', s.id)"
		>
			{{ s.name }}
		</button>
	</div>
</template>
