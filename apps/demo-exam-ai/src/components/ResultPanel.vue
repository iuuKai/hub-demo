<script setup lang="ts">
import { computed } from 'vue'
import { useExamStore } from '../stores/exam'

const exam = useExamStore()

const percent = computed(() =>
  Math.round((exam.score / exam.totalScore) * 100)
)
const level = computed(() => {
  if (percent.value >= 90) return { text: '优秀', color: '#22c55e' }
  if (percent.value >= 75) return { text: '良好', color: '#3b82f6' }
  if (percent.value >= 60) return { text: '及格', color: '#f59e0b' }
  return { text: '需努力', color: '#ef4444' }
})
</script>

<template>
  <section class="result-panel">
    <div class="result-score">
      <div class="score-circle" :style="{ borderColor: level.color }">
        <span class="score-num" :style="{ color: level.color }">{{ exam.score }}</span>
        <span class="score-total">/ {{ exam.totalScore }}</span>
      </div>
      <div class="score-info">
        <div class="score-level" :style="{ color: level.color }">{{ level.text }}</div>
        <div class="score-meta">
          答对 <b>{{ exam.correctCount }}</b> 题 / 共 {{ exam.total }} 题 · 正确率
          {{ percent }}%
        </div>
        <button class="btn btn-outline" @click="exam.reset">重新考试</button>
      </div>
    </div>
    <p class="result-tip">下方可逐题查看作答与正确答案，绿色为正确选项，红色为你错选的选项。</p>
  </section>
</template>

<style scoped>
.result-panel {
  background: #fff;
  border-radius: 12px;
  padding: 28px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}
.result-score {
  display: flex;
  align-items: center;
  gap: 28px;
}
.score-circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.score-num {
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
}
.score-total {
  font-size: 14px;
  color: var(--text-light);
  margin-top: 4px;
}
.score-info {
  flex: 1;
}
.score-level {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}
.score-meta {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 16px;
}
.score-meta b {
  color: var(--text);
}
.result-tip {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
  font-size: 13px;
  color: var(--text-light);
}
</style>
