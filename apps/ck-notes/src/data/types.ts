export type FeatureId = 'classes' | 'mistakes' | 'outlines'

export interface Chapter {
	day: number
	label: string
	html?: string
	png?: string
	/** 图片真实宽高（来自 PNG 头部，用于懒加载占位定位） */
	w?: number
	h?: number
}

export interface NotesIndex {
	generatedAt: string
	subjects: string[]
	classes: Record<string, Chapter[]>
	mistakes: Record<string, string>
	outlines: Record<string, string>
}

export const SUBJECTS = [
	{ id: '政治', name: '政治' },
	{ id: '英语', name: '英语' },
	{ id: '高数二', name: '高数二' }
] as const

export type SubjectId = (typeof SUBJECTS)[number]['id']
