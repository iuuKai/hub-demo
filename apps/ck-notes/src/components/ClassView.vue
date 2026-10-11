<script setup lang="ts">
import { computed } from 'vue'
import {
	store,
	currentChapters,
	setClassMode,
	setImageLayout,
	setChapter
} from '../composables/useNotesStore'
import HtmlViewer from './HtmlViewer.vue'
import ImageViewer from './ImageViewer.vue'

const chapters = currentChapters
const chapter = computed(() => chapters.value[store.chapterIndex])
const htmlSrc = computed(() => (chapter.value?.html ? `${import.meta.env.BASE_URL}${chapter.value.html}` : ''))
</script>

<template>
	<div class="class-view">
		<div v-if="chapters.length === 0" class="empty">该科目暂无讲义内容</div>
		<template v-else>
			<div class="toolbar">
				<div class="seg" role="group" aria-label="展示方式">
					<button
						type="button"
						:class="{ active: store.classMode === 'html' }"
						@click="setClassMode('html')"
					>
						HTML 讲义
					</button>
					<button
						type="button"
						:class="{ active: store.classMode === 'image' }"
						@click="setClassMode('image')"
					>
						图片浏览
					</button>
				</div>

				<template v-if="store.classMode === 'image'">
					<div class="seg" role="group" aria-label="图片浏览方式">
						<button
							type="button"
							:class="{ active: store.imageLayout === 'scroll' }"
							@click="setImageLayout('scroll')"
						>
							滚动
						</button>
						<button
							type="button"
							:class="{ active: store.imageLayout === 'page' }"
							@click="setImageLayout('page')"
						>
							翻页
						</button>
					</div>
					<span v-if="store.imageLayout === 'page'" class="counter">
						{{ store.chapterIndex + 1 }} / {{ chapters.length }}
					</span>
				</template>

				<span v-if="chapter" class="chapter-title">{{ chapter.label }}</span>
			</div>

			<div class="viewer">
				<template v-if="store.classMode === 'html'">
					<div class="html-wrap">
						<HtmlViewer
							v-if="htmlSrc"
							:key="`h-${store.subject}-${store.chapterIndex}`"
							:src="htmlSrc"
						/>
						<p v-else class="empty">
							本章暂无 HTML 讲义，可切换到「图片浏览」查看
						</p>
					</div>
					<div v-if="chapters.length > 1" class="html-pager">
						<button
							type="button"
							class="page-nav"
							:disabled="store.chapterIndex <= 0"
							@click="setChapter(store.chapterIndex - 1)"
						>
							‹ 上一页
						</button>
						<span class="pager-count">
							{{ store.chapterIndex + 1 }} / {{ chapters.length }}
						</span>
						<button
							type="button"
							class="page-nav"
							:disabled="store.chapterIndex >= chapters.length - 1"
							@click="setChapter(store.chapterIndex + 1)"
						>
							下一页 ›
						</button>
					</div>
				</template>
				<ImageViewer
					v-else-if="store.classMode === 'image'"
					:chapters="chapters"
					:layout="store.imageLayout"
					:current="store.chapterIndex"
					@change="setChapter"
				/>
			</div>
		</template>
	</div>
</template>

<style scoped>
.class-view {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.toolbar {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
	padding: 2px 0 12px;
}

.counter {
	font-size: 13px;
	color: var(--muted);
	white-space: nowrap;
}

.chapter-title {
	font-size: 14px;
	font-weight: 600;
	color: var(--text);
	margin-left: auto;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.viewer {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.viewer > * {
	flex: 1;
	min-height: 0;
}

/* HTML 讲义：内容区占满，底部固定翻页条 */
.html-wrap {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.html-wrap > * {
	flex: 1;
	min-height: 0;
}

.html-pager {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	padding: 10px 0 2px;
	border-top: 1px solid var(--border);
	margin-top: 8px;
}

.page-nav {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 7px 18px;
	border: 1px solid var(--border);
	border-radius: 999px;
	background: var(--card);
	color: var(--text);
	font-size: 14px;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease;
}

.page-nav:hover:not(:disabled) {
	border-color: var(--brand);
	background: var(--brand-weak);
}

.page-nav:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.pager-count {
	font-size: 13px;
	color: var(--muted);
	white-space: nowrap;
}
</style>
