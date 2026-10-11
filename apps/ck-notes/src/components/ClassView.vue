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
						<!-- 左右悬浮翻页按钮（同图片翻页样式，z-index 高于内容） -->
						<button
							v-if="htmlSrc && chapters.length > 1"
							type="button"
							class="html-page-btn prev"
							:disabled="store.chapterIndex <= 0"
							aria-label="上一页"
							@click="setChapter(store.chapterIndex - 1)"
						>
							‹
						</button>
						<button
							v-if="htmlSrc && chapters.length > 1"
							type="button"
							class="html-page-btn next"
							:disabled="store.chapterIndex >= chapters.length - 1"
							aria-label="下一页"
							@click="setChapter(store.chapterIndex + 1)"
						>
							›
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

/* HTML 讲义：内容区占满，左右悬浮翻页按钮 */
.html-wrap {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	position: relative;
}

.html-wrap > * {
	flex: 1;
	min-height: 0;
}

.html-page-btn {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: rgba(15, 23, 42, 0.45);
	color: #fff;
	font-size: 26px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 20;
	transition: background 0.15s ease;
}

.html-page-btn:hover:not(:disabled) {
	background: rgba(15, 23, 42, 0.65);
}

.html-page-btn:disabled {
	opacity: 0.35;
	cursor: not-allowed;
}

.html-page-btn.prev {
	left: 10px;
}

.html-page-btn.next {
	right: 10px;
}
</style>
