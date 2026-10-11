import { computed, reactive } from 'vue'
import type { FeatureId, NotesIndex, SubjectId } from '../data/types'
import { SUBJECTS } from '../data/types'

/**
 * 状态全部放在 URL query 中（可分享、可刷新恢复），不使用 localStorage。
 * 参数：
 *   ?feature=classes|mistakes|outlines
 *   &subject=政治|英语|高数二
 *   &day=N            （讲义中第 N 天，仅 feature=classes 时有意义）
 *   &mode=html|image  （讲义浏览方式，仅 feature=classes）
 *   &layout=scroll|page（图片浏览布局，仅 feature=classes 且 mode=image）
 */
function parseParams() {
	const q = new URLSearchParams(window.location.search)
	return {
		subject: q.get('subject') ?? '',
		feature: q.get('feature') ?? '',
		mode: q.get('mode') ?? '',
		layout: q.get('layout') ?? '',
		day: (() => {
			const d = Number(q.get('day'))
			return Number.isInteger(d) && d >= 1 ? d : 0
		})()
	}
}

function validSubject(v: unknown): v is SubjectId {
	return SUBJECTS.some((s) => s.id === v)
}

function validFeature(v: unknown): v is FeatureId {
	return v === 'classes' || v === 'mistakes' || v === 'outlines'
}

const initial = parseParams()

export const store = reactive({
	index: null as NotesIndex | null,
	status: 'loading' as 'loading' | 'ready' | 'error',
	error: '',
	subject: (validSubject(initial.subject) ? initial.subject : SUBJECTS[0].id) as SubjectId,
	feature: (validFeature(initial.feature) ? initial.feature : 'classes') as FeatureId,
	classMode: (initial.mode === 'image' ? 'image' : 'html') as 'html' | 'image',
	imageLayout: (initial.layout === 'page' ? 'page' : 'scroll') as 'scroll' | 'page',
	/** 侧边栏折叠仅当前会话生效，不持久化 */
	sidebarCollapsed: false,
	chapterIndex: 0
})

/** 把当前状态写回地址栏（replaceState：不产生历史记录，刷新/分享均可恢复） */
function syncUrl() {
	const params = new URLSearchParams()
	params.set('feature', store.feature)
	params.set('subject', store.subject)
	if (store.feature === 'classes') {
		params.set('day', String(store.chapterIndex + 1))
		params.set('mode', store.classMode)
		if (store.classMode === 'image') params.set('layout', store.imageLayout)
	}
	const qs = params.toString()
	const url = `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`
	history.replaceState(null, '', url)
}

export async function loadIndex() {
	store.status = 'loading'
	try {
		const res = await fetch(`${import.meta.env.BASE_URL}notes-index.json`, { cache: 'no-cache' })
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		store.index = (await res.json()) as NotesIndex
		store.status = 'ready'
		// 索引就绪后再套用 URL 里的 day（需要知道科目章节数做校验）
		const p = parseParams()
		const chapters = store.index.classes?.[store.subject] ?? []
		if (p.day > 0 && p.day <= chapters.length) store.chapterIndex = p.day - 1
		clampChapter()
		syncUrl()
	} catch (e) {
		store.status = 'error'
		store.error = e instanceof Error ? e.message : String(e)
	}
}

function clampChapter() {
	const chapters = store.index?.classes?.[store.subject] ?? []
	if (store.chapterIndex >= chapters.length) store.chapterIndex = 0
}

export function setSubject(id: SubjectId) {
	store.subject = id
	store.chapterIndex = 0
	syncUrl()
}

export function setFeature(feature: FeatureId) {
	store.feature = feature
	store.chapterIndex = 0
	syncUrl()
}

export function setClassMode(mode: 'html' | 'image') {
	store.classMode = mode
	syncUrl()
}

export function setImageLayout(layout: 'scroll' | 'page') {
	store.imageLayout = layout
	syncUrl()
}

export function setChapter(index: number) {
	const chapters = store.index?.classes?.[store.subject] ?? []
	if (index >= 0 && index < chapters.length) {
		store.chapterIndex = index
		syncUrl()
	}
}

export function toggleSidebar() {
	store.sidebarCollapsed = !store.sidebarCollapsed
}

/** 当前科目在讲义中的章节列表 */
export const currentChapters = computed(() => store.index?.classes?.[store.subject] ?? [])

/** 当前科目在错题/大纲中的 html 相对路径 */
export const currentDoc = computed(() => {
	if (!store.index) return ''
	if (store.feature === 'mistakes') return store.index.mistakes[store.subject] ?? ''
	if (store.feature === 'outlines') return store.index.outlines[store.subject] ?? ''
	return ''
})
