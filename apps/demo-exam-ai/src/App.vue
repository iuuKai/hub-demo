<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useExamStore } from './stores/exam'
import ExamHeader from './components/ExamHeader.vue'
import QuestionCard from './components/QuestionCard.vue'
import QuestionNav from './components/QuestionNav.vue'
import ResultPanel from './components/ResultPanel.vue'

const exam = useExamStore()

onMounted(() => {
  exam.startTimer()
})
onUnmounted(() => {
  // store 自身管理 timer，这里无需额外清理
})
</script>

<template>
  <div class="exam-container">
    <div class="exam-wrap">
      <!-- 考试中：头部 -->
      <ExamHeader v-if="!exam.submitted" />
      <!-- 交卷后：成绩面板 -->
      <ResultPanel v-else />

      <div class="exam-body">
        <main class="exam-main">
          <QuestionCard />

          <!-- 底部导航：仅考试中显示 -->
          <div v-if="!exam.submitted" class="footer-nav">
            <button
              class="btn btn-outline"
              :disabled="exam.currentIndex === 0"
              @click="exam.prev"
            >
              上一题
            </button>
            <span class="page-indicator"
              >{{ exam.currentIndex + 1 }} / {{ exam.total }}</span
            >
            <button
              v-if="exam.currentIndex < exam.total - 1"
              class="btn btn-primary"
              @click="exam.next"
            >
              下一题
            </button>
            <button v-else class="btn btn-primary" @click="exam.next" disabled>
              已是最后一题
            </button>
          </div>
        </main>

        <QuestionNav />
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-container {
  min-height: 100%;
  padding: 20px;
}
.exam-wrap {
  max-width: 1100px;
  margin: 0 auto;
}
.exam-body {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 20px;
  align-items: start;
}
.exam-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.footer-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 14px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.page-indicator {
  font-size: 14px;
  color: var(--text-light);
}
@media (max-width: 860px) {
  .exam-body {
    grid-template-columns: 1fr;
  }
}
</style>
