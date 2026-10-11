<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { Chapter } from '../data/types'

const props = defineProps<{
	chapters: Chapter[]
	layout: 'scroll' | 'page'
	current: number
}>()

const emit = defineEmits<{ (e: 'change', index: number): void }>()

const BASE = import.meta.env.BASE_URL

/** 有 png 的章节（渲染单元） */
const pageItems = computed(() => props.chapters.filter((c) => Boolean(c.png)))

const pageItem = computed(() => {
	const item = pageItems.value[props.current]
	return item?.png ? `${BASE}${item.png}` : ''
})

const pageLabel = computed(() => pageItems.value[props.current]?.label ?? '')

/** 有真实宽高时用 aspect-ratio 预留准确占位空间，跳章节定位不偏移 */
function lazyStyle(c: Chapter) {
	return c.w && c.h ? { aspectRatio: `${c.w} / ${c.h}`, minHeight: '0' } : {}
}

// ---------- 滚动模式：IntersectionObserver 懒加载 ----------
const imgEls = ref<(HTMLElement | null)[]>([])
let observer: IntersectionObserver | null = null

function setupObserver() {
	observer?.disconnect()
	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const el = entry.target as HTMLImageElement
					const src = el.dataset.src
					if (src && !el.dataset.loaded) {
						el.src = src
						el.dataset.loaded = '1'
					}
					observer?.unobserve(el)
				}
			}
		},
		{ rootMargin: '400px 0px' }
	)
	nextTick(() => {
		for (const el of imgEls.value) if (el) observer?.observe(el)
	})
}

function registerImg(el: Element | ComponentPublicInstance | null, index: number) {
	if (el instanceof HTMLElement) imgEls.value[index] = el
}

watch(
	() => props.layout,
	(l) => {
		if (l === 'scroll') setupObserver()
	}
)

// 科目/章节列表变化时：重建观察器并回到列表顶部，避免复用旧图片元素导致残留
watch(
	() => props.chapters,
	() => {
		if (props.layout !== 'scroll') return
		imgEls.value = []
		if (listRef.value) listRef.value.scrollTop = 0
		setupObserver()
	}
)

onMounted(() => {
	if (props.layout === 'scroll') setupObserver()
	window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
	observer?.disconnect()
	window.removeEventListener('keydown', onKey)
})

/** 滚动模式下选中章节时，平滑滚动到对应图片（immediate：URL 直达/刷新恢复也定位） */
const listRef = ref<HTMLElement | null>(null)
watch(
	() => props.current,
	() => {
		if (props.layout !== 'scroll') return
		nextTick(() => {
			const el = listRef.value?.querySelector(`[data-chapter="${props.current}"]`)
			el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		})
	},
	{ immediate: true }
)

// ---------- 翻页模式：仅加载当前页，键盘 ← → 切换 ----------
function prev() {
	if (props.current > 0) emit('change', props.current - 1)
}

function next() {
	if (props.current < pageItems.value.length - 1) emit('change', props.current + 1)
}

function onKey(e: KeyboardEvent) {
	if (props.layout !== 'page') return
	if (e.key === 'ArrowLeft') prev()
	else if (e.key === 'ArrowRight') next()
}
</script>

<template>
	<div class="image-viewer" :class="`layout-${layout}`">
		<!-- 滚动加载：全部章节图片纵向排列，可视区域附近才加载 -->
		<div v-if="layout === 'scroll'" ref="listRef" class="scroll-list">
			<section
				v-for="(c, i) in props.chapters"
				:key="c.png ?? c.day"
				v-show="c.png"
				:data-chapter="i"
				class="scroll-item"
			>
				<img
					v-if="c.png"
					:ref="(el) => registerImg(el, i)"
					:data-src="`${BASE}${c.png}`"
					:alt="c.label"
					:style="lazyStyle(c)"
					class="lazy-img"
					loading="lazy"
					@load="(e) => (e.target as HTMLImageElement).classList.add('loaded')"
				/>
			</section>
			<p v-if="pageItems.length === 0" class="empty">该科目暂无图片讲义</p>
		</div>

		<!-- 翻页：一次一张，支持前后翻页 -->
		<div v-else class="page-stage">
			<img v-if="pageItem" :src="pageItem" :alt="pageLabel" class="page-img" />
			<p v-else class="empty">该科目暂无图片讲义</p>
			<div class="page-label">{{ pageLabel }}</div>
			<button
				type="button"
				class="page-btn prev"
				:disabled="props.current <= 0"
				aria-label="上一页"
				@click="prev"
			>
				‹
			</button>
			<button
				type="button"
				class="page-btn next"
				:disabled="props.current >= pageItems.length - 1"
				aria-label="下一页"
				@click="next"
			>
				›
			</button>
		</div>
	</div>
</template>

<style scoped>
.image-viewer {
	height: 100%;
	min-height: 0;
}

/* ---------- 滚动模式 ---------- */
.scroll-list {
	height: 100%;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 2px 4px 24px;
}

.scroll-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.lazy-img {
	width: 100%;
	height: auto;
	min-height: 320px;
	object-fit: contain;
	background: var(--card);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	opacity: 0;
	transition: opacity 0.25s ease;
}

.lazy-img.loaded {
	opacity: 1;
}

/* ---------- 翻页模式 ---------- */
.page-stage {
	position: relative;
	height: 100%;
	min-height: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #101828;
	border-radius: var(--radius);
	overflow: hidden;
}

.page-img {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
	border-radius: var(--radius);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}

.page-label {
	position: absolute;
	top: 12px;
	left: 12px;
	background: rgba(0, 0, 0, 0.55);
	color: #fff;
	font-size: 12px;
	padding: 4px 10px;
	border-radius: 999px;
	backdrop-filter: blur(4px);
}

.page-btn {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.12);
	color: #fff;
	font-size: 26px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.15s ease;
	backdrop-filter: blur(4px);
}

.page-btn:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.28);
}

.page-btn.prev {
	left: 12px;
}

.page-btn.next {
	right: 12px;
}
</style>
