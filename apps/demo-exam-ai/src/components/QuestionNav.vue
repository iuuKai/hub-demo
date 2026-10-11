<script setup lang="ts">
import { ref } from 'vue'
import { useExamStore } from '../stores/exam'

const exam = useExamStore()
const showConfirm = ref(false)

function confirmSubmit() {
  showConfirm.value = true
}
function doSubmit() {
  exam.submit()
  showConfirm.value = false
}
function cancelSubmit() {
  showConfirm.value = false
}
</script>

<template>
  <aside class="nav-panel">
    <h3 class="nav-title">答题卡</h3>
    <div class="nav-grid">
      <button
        v-for="(q, i) in exam.questions"
        :key="q.id"
        class="nav-item"
        :class="{
          current: i === exam.currentIndex,
          answered: exam.isAnswered(q.id)
        }"
        @click="exam.goTo(i)"
      >
        {{ i + 1 }}
      </button>
    </div>

    <div class="nav-legend">
      <span><i class="dot answered"></i>已答</span>
      <span><i class="dot"></i>未答</span>
      <span><i class="dot current"></i>当前</span>
    </div>

    <div class="nav-actions">
      <button
        class="btn btn-primary submit-btn"
        :disabled="exam.submitted"
        @click="confirmSubmit"
      >
        交卷
      </button>
    </div>

    <!-- 确认弹窗 -->
    <div v-if="showConfirm" class="modal-mask" @click.self="cancelSubmit">
      <div class="modal">
        <h4>确认交卷？</h4>
        <p>
          你已完成 <b>{{ exam.answeredCount }}</b> / {{ exam.total }} 题，
          <span v-if="exam.answeredCount < exam.total" class="warn"
            >还有 {{ exam.total - exam.answeredCount }} 题未作答</span
          >
          <span v-else>全部题目已作答</span>。
        </p>
        <p class="tip">交卷后将无法修改答案。</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="cancelSubmit">再检查一下</button>
          <button class="btn btn-danger" @click="doSubmit">确认交卷</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 20px;
}
.nav-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
}
.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.nav-item {
  aspect-ratio: 1;
  border-radius: 6px;
  background: #f3f4f6;
  color: var(--text-light);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}
.nav-item:hover {
  background: #e5e7eb;
}
.nav-item.answered {
  background: var(--primary);
  color: #fff;
}
.nav-item.current {
  outline: 2px solid var(--warning);
  outline-offset: 1px;
}
.nav-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-light);
}
.nav-legend span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: #f3f4f6;
  display: inline-block;
}
.dot.answered {
  background: var(--primary);
}
.dot.current {
  background: #fff;
  outline: 2px solid var(--warning);
}
.nav-actions {
  margin-top: 20px;
}
.submit-btn {
  width: 100%;
  padding: 10px;
  font-size: 15px;
}
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 380px;
  max-width: 90vw;
}
.modal h4 {
  font-size: 18px;
  margin-bottom: 14px;
}
.modal p {
  font-size: 14px;
  color: var(--text);
  margin-bottom: 8px;
}
.modal .warn {
  color: var(--danger);
  font-weight: 600;
}
.modal .tip {
  color: var(--text-light);
  font-size: 13px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 窄屏单栏时，题号按钮固定尺寸，一行放得下就不换行 */
@media (max-width: 860px) {
  .nav-panel {
    position: static;
  }
  .nav-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .nav-item {
    aspect-ratio: auto;
    width: 40px;
    height: 40px;
  }
}
</style>
