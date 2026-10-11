/**
 * 生成内容索引 notes-index.json（写入 .temp-content/，随内容一起被拷贝到 dist）
 *
 * 数据来源（均在 .temp-content/ 下）：
 * - classes/  ：每日讲义。文件名形如「第1天_8月28日_高数.html/.png」，
 *               解析出 day/date/科目，html 与 png 成对归入同一章节。
 * - mistakes/ ：三科错题集 html，按文件名中的科目名归类。
 * - outlines/ ：三科考试大纲 html，按「考试大纲_科目」命名归类。
 * - recites/  ：背诵要点，暂为空，未纳入索引（后续有内容时再加）。
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '.temp-content')
const CLASSES_DIR = path.join(ROOT, 'classes')
const MISTAKES_DIR = path.join(ROOT, 'mistakes')
const OUTLINES_DIR = path.join(ROOT, 'outlines')

/** 科目别名归一：讲义文件用「高数」，错题/大纲用「高数二」 */
const SUBJECT_ALIAS = { 政治: '政治', 英语: '英语', 高数: '高数二', 高数二: '高数二' }
const SUBJECTS = ['政治', '英语', '高数二']

// ---------- classes：按 第N天 分组 ----------
// 文件名形如「第1天_高数.html/.png」（旧命名「第1天_8月28日_高数.html」同样兼容，日期段已弃用）
const classes = { 政治: [], 英语: [], 高数二: [] }
const CHAPTER_RE = /^第(\d+)天(?:_\d{1,2}月\d{1,2}日)?_(政治|英语|高数)\.(html|png)$/

/** 解析 PNG 头部（IHDR 块）的宽高，无需加载整图；解析失败返回 null */
function pngSize(filePath) {
	try {
		const buf = fs.readFileSync(filePath)
		const isPng =
			buf.length >= 24 &&
			buf[0] === 0x89 &&
			buf[1] === 0x50 &&
			buf[2] === 0x4e &&
			buf[3] === 0x47
		if (!isPng) return null
		return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
	} catch {
		return null
	}
}

if (fs.existsSync(CLASSES_DIR)) {
	// 用 day 作 key 合并 html/png
	const bySubject = { 政治: {}, 英语: {}, 高数二: {} }
	for (const file of fs.readdirSync(CLASSES_DIR)) {
		const m = file.match(CHAPTER_RE)
		if (!m) continue
		const subject = SUBJECT_ALIAS[m[2]]
		const day = Number(m[1])
		if (!bySubject[subject][day]) {
			bySubject[subject][day] = { day, label: `第${day}天` }
		}
		if (m[3] === 'html') {
			bySubject[subject][day].html = `classes/${file}`
		} else {
			bySubject[subject][day].png = `classes/${file}`
			// 记录真实宽高：前端懒加载占位可预留准确空间，跳章节定位不偏移
			const size = pngSize(path.join(CLASSES_DIR, file))
			if (size) {
				bySubject[subject][day].w = size.w
				bySubject[subject][day].h = size.h
			}
		}
	}
	for (const subject of SUBJECTS) {
		classes[subject] = Object.values(bySubject[subject]).sort((a, b) => a.day - b.day)
	}
}

// ---------- mistakes ----------
const mistakes = {}
if (fs.existsSync(MISTAKES_DIR)) {
	for (const file of fs.readdirSync(MISTAKES_DIR)) {
		if (!/\.html$/i.test(file)) continue
		const subject = SUBJECTS.find((s) => file.includes(s))
		if (subject) mistakes[subject] = `mistakes/${file}`
	}
}

// ---------- outlines ----------
const outlines = {}
const OUTLINE_RE = /^考试大纲_(政治|英语|高数二?)\.html$/
if (fs.existsSync(OUTLINES_DIR)) {
	for (const file of fs.readdirSync(OUTLINES_DIR)) {
		if (!/\.html$/i.test(file)) continue
		const m = file.match(OUTLINE_RE)
		if (!m) continue
		const subject = SUBJECT_ALIAS[m[1]]
		if (subject) outlines[subject] = `outlines/${file}`
	}
}

const index = {
	generatedAt: new Date().toISOString(),
	subjects: SUBJECTS,
	classes,
	mistakes,
	outlines
}

const total = SUBJECTS.reduce((sum, s) => sum + (classes[s]?.length ?? 0), 0)
const outPath = path.join(ROOT, 'notes-index.json')
fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf8')
console.log(`[ck-notes] index generated: ${outPath} (${total} chapters)`)
