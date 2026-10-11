import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { EXAM_DURATION, QUESTIONS, type Question } from '../data/questions'

export type AnswerMap = Record<number, string[]>

export const useExamStore = defineStore('exam', () => {
  const questions = ref<Question[]>(QUESTIONS)
  const currentIndex = ref(0)
  const answers = ref<AnswerMap>({})
  const submitted = ref(false)
  const remaining = ref(EXAM_DURATION)
  let timer: ReturnType<typeof setInterval> | null = null

  const total = computed(() => questions.value.length)
  const totalScore = computed(() =>
    questions.value.reduce((sum, q) => sum + q.score, 0)
  )
  const currentQuestion = computed(() => questions.value[currentIndex.value])
  const answeredCount = computed(
    () => Object.values(answers.value).filter((a) => a.length > 0).length
  )
  const isFinished = computed(() => answeredCount.value === total.value)

  /** 得分：答案数组完全一致才得分 */
  const score = computed(() => {
    return questions.value.reduce((sum, q) => {
      const user = (answers.value[q.id] ?? []).slice().sort().join(',')
      const correct = q.answer.slice().sort().join(',')
      return sum + (user === correct && user !== '' ? q.score : 0)
    }, 0)
  })

  const correctCount = computed(() =>
    questions.value.filter((q) => {
      const user = (answers.value[q.id] ?? []).slice().sort().join(',')
      const correct = q.answer.slice().sort().join(',')
      return user === correct && user !== ''
    }).length
  )

  function isAnswered(qid: number) {
    return (answers.value[qid] ?? []).length > 0
  }

  function selectOption(qid: number, key: string, multiple: boolean) {
    if (submitted.value) return
    const current = answers.value[qid] ?? []
    if (multiple) {
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key]
      answers.value[qid] = next
    } else {
      answers.value[qid] = [key]
    }
  }

  function goTo(index: number) {
    if (index < 0 || index >= total.value) return
    currentIndex.value = index
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function submit() {
    submitted.value = true
    stopTimer()
  }

  function startTimer() {
    if (timer) return
    timer = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value -= 1
      } else {
        submit()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function reset() {
    stopTimer()
    currentIndex.value = 0
    answers.value = {}
    submitted.value = false
    remaining.value = EXAM_DURATION
    startTimer()
  }

  return {
    questions,
    currentIndex,
    answers,
    submitted,
    remaining,
    total,
    totalScore,
    currentQuestion,
    answeredCount,
    isFinished,
    score,
    correctCount,
    isAnswered,
    selectOption,
    goTo,
    prev,
    next,
    submit,
    startTimer,
    reset
  }
})
