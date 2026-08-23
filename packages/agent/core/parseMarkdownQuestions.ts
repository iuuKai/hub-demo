export type ChoiceQuestion = {
	type: 'choice'
	stem: string
	options: string[]
	answer: string
	analysis?: string
}

export type JudgeQuestion = {
	type: 'judge'
	stem: string
	answer: '对' | '错'
	analysis?: string
}

export type Question = ChoiceQuestion | JudgeQuestion

export type ParsedPaper = {
	questions: Question[]
	rawMarkdown: string
	parseWarnings: string[]
}

const NUMBER_RE = /^第\s*(\d+)\s*题/
const TYPE_RE = /（\s*([^）]+?)\s*）|\(\s*([^)]+?)\s*\)/
const ANSWER_RE = /^答案\s*[:：]\s*(.+)$/
const STEM_RE = /^题干\s*[:：]\s*(.+)$/
const OPTIONS_RE = /^选项\s*[:：]\s*(.+)$/
const ANALYSIS_RE = /^解析\s*[:：]\s*(.+)$/
const HEADING_RE = /^#{2,6}\s*(.+)$/
const LIST_ITEM_RE = /^\s*([A-Z])[\s.、．)]+\s*(.+)$/

function strip(s: string): string {
	return s.replace(/\s+/g, ' ').trim()
}

function normalizeAnswer(raw: string): '对' | '错' | string {
	const s = strip(raw)
	if (/^(对|正确|是|true|T|√)$/i.test(s)) return '对'
	if (/^(错|错误|否|false|F|×)$/i.test(s)) return '错'
	return s
}

function parseOptionsLine(line: string, acc: Record<string, string>): Record<string, string> {
	const input = strip(line)
	if (!input) return acc

	const regex = /(^|[\s，；;])([A-Z])\s*[.、．:：)）]\s*([^\sA-Z，；;][^A-Z，；;]*)/g

	let match: RegExpExecArray | null
	while ((match = regex.exec(input)) !== null) {
		const key = match[2].toUpperCase()
		const value = strip(match[3])
		if (value) acc[key] = value
	}

	const simple = LIST_ITEM_RE.exec(input)
	if (simple) {
		acc[simple[1].toUpperCase()] = strip(simple[2])
	}

	return acc
}

export function parseMarkdownQuestions(markdown: string): ParsedPaper {
	const rawMarkdown = markdown
	const parseWarnings: string[] = []
	const questions: Question[] = []

	const blocks = markdown
		.replace(/<task_finish>/g, '')
		.split(/\n(?:\s*\n)+/)
		.map(b => b.trim())
		.filter(Boolean)

	for (let bi = 0; bi < blocks.length; bi++) {
		const block = blocks[bi]
		const lines = block.split(/\n/).map(l => l.trim())

		let firstLine = lines[0] || ''
		const heading = HEADING_RE.exec(firstLine)
		if (heading) firstLine = heading[1]

		if (!NUMBER_RE.test(firstLine)) continue

		const typeMatch = TYPE_RE.exec(firstLine)
		const typeHint = strip(typeMatch?.[1] ?? typeMatch?.[2] ?? '').toLowerCase()

		const bodyLines = heading ? lines.slice(1) : lines.slice(1)
		const allBody = (firstLine + '\n' + bodyLines.join('\n')).split(/\n/)

		let stem = ''
		let answer = ''
		let analysis = ''
		const optionMap: Record<string, string> = {}

		let i = 0
		while (i < allBody.length) {
			const raw = allBody[i]
			const line = strip(raw)
			if (!line) {
				i++
				continue
			}

			const stemM = STEM_RE.exec(line)
			if (stemM) {
				stem = strip(stemM[1])
				i++
				continue
			}
			const ansM = ANSWER_RE.exec(line)
			if (ansM) {
				answer = normalizeAnswer(ansM[1])
				i++
				continue
			}
			const anaM = ANALYSIS_RE.exec(line)
			if (anaM) {
				analysis = strip(anaM[1])
				i++
				continue
			}
			const optM = OPTIONS_RE.exec(line)
			if (optM) {
				parseOptionsLine(optM[1], optionMap)
				i++
				continue
			}
			const listM = LIST_ITEM_RE.exec(line)
			if (listM) {
				let value = strip(listM[2])
				let j = i + 1
				while (
					j < allBody.length &&
					strip(allBody[j]) &&
					!LIST_ITEM_RE.test(strip(allBody[j])) &&
					!/^(题干|答案|解析|选项)\s*[:：]/.test(strip(allBody[j]))
				) {
					value += ' ' + strip(allBody[j])
					j++
				}
				optionMap[listM[1].toUpperCase()] = strip(value)
				i = j
				continue
			}

			if (/^选项\s*[:：]?\s*$/.test(line)) {
				let j = i + 1
				while (j < allBody.length && !/^(题干|答案|解析)\s*[:：]/.test(strip(allBody[j]))) {
					const l = strip(allBody[j])
					if (l) parseOptionsLine(l, optionMap)
					j++
				}
				i = j
				continue
			}

			if (!stem && !/^(题干|答案|解析|选项)\s*[:：]/.test(line)) {
				stem = strip(line)
			}
			i++
		}

		const isJudge =
			/判断|是非|对|错|judge|true.*false/i.test(typeHint) || answer === '对' || answer === '错'
		const isChoice =
			/选择|单选|多选|choice|option/i.test(typeHint) || Object.keys(optionMap).length > 0

		if (isJudge || (!isChoice && (answer === '对' || answer === '错'))) {
			if (!stem) {
				parseWarnings.push(`第${questions.length + 1}题缺少题干，已跳过`)
				continue
			}
			const normalized = answer === '对' || answer === '错' ? (answer as '对' | '错') : '对'
			const q: JudgeQuestion = {
				type: 'judge',
				stem,
				answer: normalized
			}
			if (analysis) q.analysis = analysis
			questions.push(q)
			continue
		}

		const optionKeys = Object.keys(optionMap).sort()
		if (optionKeys.length === 0) {
			parseWarnings.push(`第${questions.length + 1}题缺少选项，按单选项生成占位`)
		}
		if (!stem) {
			parseWarnings.push(`第${questions.length + 1}题缺少题干，已跳过`)
			continue
		}
		const options = optionKeys.map(k => `${k}. ${optionMap[k]}`)
		if (options.length === 0) options.push('A. 选项缺失')
		let choiceAnswer = answer
		if (
			optionKeys.length > 0 &&
			optionKeys.every(k => k.length === 1) &&
			choiceAnswer &&
			/^[A-Z]$/.test(choiceAnswer) === false
		) {
			const first = choiceAnswer.slice(0, 1).toUpperCase()
			if (/^[A-Z]$/.test(first)) choiceAnswer = first
		}
		const q: ChoiceQuestion = {
			type: 'choice',
			stem,
			options,
			answer: choiceAnswer || optionKeys[0] || 'A'
		}
		if (analysis) q.analysis = analysis
		questions.push(q)
	}

	return { questions, rawMarkdown, parseWarnings }
}
