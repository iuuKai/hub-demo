<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
	store,
	loadIndex,
	setSubject,
	setFeature,
	setChapter,
	toggleSidebar,
	currentChapters
} from './composables/useNotesStore'
import FeatureTabs from './components/FeatureTabs.vue'
import SubjectBar from './components/SubjectBar.vue'
import ChapterPicker from './components/ChapterPicker.vue'
import ClassView from './components/ClassView.vue'
import DocView from './components/DocView.vue'

onMounted(loadIndex)

const loading = computed(() => store.status === 'loading')
const error = computed(() => store.status === 'error')
const ready = computed(() => store.status === 'ready')
const chapters = currentChapters
</script>

<template>
	<div class="app" :class="{ 'sidebar-collapsed': store.sidebarCollapsed }">
		<header class="app-header">
			<button
				type="button"
				class="sidebar-toggle"
				:aria-label="store.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
				:aria-expanded="!store.sidebarCollapsed"
				@click="toggleSidebar"
			>
				<span class="toggle-line"></span>
				<span class="toggle-line"></span>
				<span class="toggle-line"></span>
			</button>
			<div class="brand">
				<span class="brand-mark">成考</span>
				<div class="brand-text">
					<h1>备考资料库</h1>
					<p>成人高考专升本 · 政治 / 英语 / 高数二</p>
				</div>
			</div>
		</header>

		<div class="app-body">
			<!-- 桌面端侧栏 -->
			<aside class="app-aside">
				<div class="aside-block">
					<div class="aside-title">功能</div>
					<FeatureTabs :model-value="store.feature" vertical @update:model-value="setFeature" />
				</div>
				<div class="aside-block">
					<div class="aside-title">科目</div>
					<SubjectBar wrap :model-value="store.subject" @update:model-value="setSubject" />
				</div>
				<div v-if="store.feature === 'classes'" class="aside-block">
					<div class="aside-title">章节（第 N 天）</div>
					<ChapterPicker
						wrap
						:chapters="chapters"
						:model-value="store.chapterIndex"
						@update:model-value="setChapter"
					/>
				</div>
			</aside>

			<!-- 主区域 -->
			<main class="app-main">
				<!-- 移动端顶部：科目 + 章节 -->
				<div class="mobile-top">
					<SubjectBar :model-value="store.subject" @update:model-value="setSubject" />
					<ChapterPicker
						v-if="store.feature === 'classes'"
						:chapters="chapters"
						:model-value="store.chapterIndex"
						@update:model-value="setChapter"
					/>
				</div>

				<div class="main-slot">
					<div v-if="loading" class="state">正在加载学习资料…</div>
					<div v-else-if="error" class="state error">
						<p>学习资料索引加载失败（{{ error }}）</p>
						<p class="hint">
							请先在 <code>apps/ck-notes</code> 目录运行 <code>pnpm sync</code>（同步
							<code>content/ck-notes</code> 并生成索引），然后刷新本页。
						</p>
					</div>
					<template v-else-if="ready">
						<ClassView v-if="store.feature === 'classes'" />
						<DocView v-else />
					</template>
				</div>
			</main>
		</div>

		<!-- 移动端底部导航 -->
		<nav class="bottom-nav">
			<FeatureTabs :model-value="store.feature" @update:model-value="setFeature" />
		</nav>
	</div>
</template>
