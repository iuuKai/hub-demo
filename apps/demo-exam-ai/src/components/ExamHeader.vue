<script setup lang="ts">
import { computed } from 'vue'
import { useExamStore } from '../stores/exam'

const exam = useExamStore()

const timeText = computed(() => {
  const m = Math.floor(exam.remaining / 60)
    .toString()
    .padStart(2, '0')
  const s = (exam.remaining % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const lowTime = computed(() => exam.remaining <= 60)
const progress = computed(() => (exam.answeredCount / exam.total) * 100)
</script>

<template>
  <header class="exam-header">
    <div class="header-left">
      <h1 class="title">前端知识在线考试</h1>
      <p class="subtitle">共 {{ exam.total }} 题 · 满分 {{ exam.totalScore }} 分</p>
    </div>
    <div class="header-right">
      <div class="timer" :class="{ warning: lowTime }">
        <span class="timer-label">剩余时间</span>
        <span class="timer-value">{{ timeText }}</span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      <span class="progress-text">已答 {{ exam.answeredCount }} / {{ exam.total }}</span>
    </div>
  </header>
</template>

<style scoped>
.exam-header {
  background: #fff;
  border-radius: 12px;
  padding: 20px 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}
.header-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}
.title {
  font-size: 22px;
  font-weight: 700;
}
.subtitle {
  color: var(--text-light);
  font-size: 13px;
}
.header-right {
  float: right;
  margin-top: -48px;
}
.timer {
  text-align: right;
}
.timer-label {
  display: block;
  font-size: 12px;
  color: var(--text-light);
}
.timer-value {
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}
.timer.warning .timer-value {
  color: var(--danger);
  animation: blink 1s infinite;
}
@keyframes blink {
  50% {
    opacity: 0.4;
  }
}
.progress-bar {
  position: relative;
  margin-top: 16px;
  height: 8px;
  background: #eef0f5;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #7c9bff);
  border-radius: 4px;
  transition: width 0.3s;
}
.progress-text {
  position: absolute;
  right: 0;
  top: -22px;
  font-size: 12px;
  color: var(--text-light);
}
</style>
