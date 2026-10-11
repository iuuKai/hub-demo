<script setup lang="ts">
import { computed } from 'vue'
import { useExamStore } from '../stores/exam'

const exam = useExamStore()

const q = computed(() => exam.currentQuestion)
const selected = computed(() => exam.answers[q.value.id] ?? [])
const isMultiple = computed(() => q.value.type === 'multiple')

const typeLabel = computed(() => {
  switch (q.value.type) {
    case 'single':
      return '单选题'
    case 'multiple':
      return '多选题'
    case 'judge':
      return '判断题'
  }
})

function handleSelect(key: string) {
  exam.selectOption(q.value.id, key, isMultiple.value)
}

function isSelected(key: string) {
  return selected.value.includes(key)
}

/** 交卷后判断该选项是否正确 */
function optionState(key: string) {
  if (!exam.submitted) return 'normal'
  const isCorrectAnswer = q.value.answer.includes(key)
  const isUserPick = selected.value.includes(key)
  if (isCorrectAnswer) return 'correct'
  if (isUserPick && !isCorrectAnswer) return 'wrong'
  return 'normal'
}
</script>

<template>
  <section class="question-card" v-if="q">
    <div class="q-meta">
      <span class="q-index">第 {{ exam.currentIndex + 1 }} 题</span>
      <span class="q-type">{{ typeLabel }}</span>
      <span class="q-score">{{ q.score }} 分</span>
    </div>
    <h2 class="q-title">{{ q.title }}</h2>
    <div class="options">
      <div
        v-for="opt in q.options"
        :key="opt.key"
        class="option"
        :class="{
          selected: isSelected(opt.key) && !exam.submitted,
          correct: optionState(opt.key) === 'correct',
          wrong: optionState(opt.key) === 'wrong'
        }"
        @click="handleSelect(opt.key)"
      >
        <span class="option-key">{{ opt.key }}</span>
        <span class="option-text">{{ opt.text }}</span>
      </div>
    </div>
    <p v-if="isMultiple && !exam.submitted" class="tip">多选题，可选择多个答案</p>

    <div v-if="exam.submitted" class="result-line">
      <span class="label">你的答案：</span>
      <span class="value">{{ selected.length ? selected.join('、') : '未作答' }}</span>
      <span class="label">正确答案：</span>
      <span class="value correct">{{ q.answer.join('、') }}</span>
    </div>
  </section>
</template>

<style scoped>
.question-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  min-height: 420px;
}
.q-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.q-meta span {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 4px;
  background: #eef2ff;
  color: var(--primary);
}
.q-type {
  background: #fef3c7 !important;
  color: #b45309 !important;
}
.q-score {
  background: #ecfdf5 !important;
  color: #047857 !important;
}
.q-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.7;
  margin-bottom: 24px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.option:hover {
  border-color: var(--primary);
  background: #f8faff;
}
.option.selected {
  border-color: var(--primary);
  background: #eef2ff;
}
.option.correct {
  border-color: var(--success);
  background: #ecfdf5;
}
.option.wrong {
  border-color: var(--danger);
  background: #fef2f2;
}
.option-key {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}
.option.selected .option-key {
  background: var(--primary);
  color: #fff;
}
.option.correct .option-key {
  background: var(--success);
  color: #fff;
}
.option.wrong .option-key {
  background: var(--danger);
  color: #fff;
}
.option-text {
  flex: 1;
  padding-top: 2px;
}
.tip {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-light);
}
.result-line {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px dashed var(--border);
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  align-items: center;
}
.result-line .label {
  color: var(--text-light);
}
.result-line .value {
  font-weight: 600;
}
.result-line .correct {
  color: var(--success);
}
</style>
