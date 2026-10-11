export type QuestionType = 'single' | 'multiple' | 'judge'

export interface QuestionOption {
  key: string
  text: string
}

export interface Question {
  id: number
  type: QuestionType
  title: string
  options: QuestionOption[]
  /** 正确答案的 key 数组 */
  answer: string[]
  /** 分值 */
  score: number
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'single',
    title: 'Vue 3 中，用于创建响应式状态的组合式 API 是？',
    options: [
      { key: 'A', text: 'ref / reactive' },
      { key: 'B', text: 'data()' },
      { key: 'C', text: 'computed only' },
      { key: 'D', text: 'watch only' }
    ],
    answer: ['A'],
    score: 10
  },
  {
    id: 2,
    type: 'single',
    title: 'Pinia 中定义 store 的函数名是？',
    options: [
      { key: 'A', text: 'createStore' },
      { key: 'B', text: 'defineStore' },
      { key: 'C', text: 'useStore' },
      { key: 'D', text: 'new Store' }
    ],
    answer: ['B'],
    score: 10
  },
  {
    id: 3,
    type: 'single',
    title: '在 Vue 3 模板中，双向绑定一个输入框应使用哪个指令？',
    options: [
      { key: 'A', text: 'v-bind' },
      { key: 'B', text: 'v-on' },
      { key: 'C', text: 'v-model' },
      { key: 'D', text: 'v-if' }
    ],
    answer: ['C'],
    score: 10
  },
  {
    id: 4,
    type: 'judge',
    title: 'Pinia 支持在组件外直接使用 store 实例。',
    options: [
      { key: 'T', text: '正确' },
      { key: 'F', text: '错误' }
    ],
    answer: ['T'],
    score: 10
  },
  {
    id: 5,
    type: 'multiple',
    title: '以下哪些属于 Vue 3 的生命周期钩子？（多选）',
    options: [
      { key: 'A', text: 'onMounted' },
      { key: 'B', text: 'onUpdated' },
      { key: 'C', text: 'onUnmounted' },
      { key: 'D', text: 'onCreated' }
    ],
    answer: ['A', 'B', 'C'],
    score: 10
  },
  {
    id: 6,
    type: 'single',
    title: 'computed 的默认返回值具有什么特性？',
    options: [
      { key: 'A', text: '可直接修改' },
      { key: 'B', text: '只读且带缓存' },
      { key: 'C', text: '每次访问都重新计算' },
      { key: 'D', text: '必须异步执行' }
    ],
    answer: ['B'],
    score: 10
  },
  {
    id: 7,
    type: 'judge',
    title: '在 Pinia 中，state 可以直接在组件中被修改，无需通过 mutations。',
    options: [
      { key: 'T', text: '正确' },
      { key: 'F', text: '错误' }
    ],
    answer: ['T'],
    score: 10
  },
  {
    id: 8,
    type: 'multiple',
    title: '以下哪些方式可以在 Vue 3 中监听数据变化？（多选）',
    options: [
      { key: 'A', text: 'watch' },
      { key: 'B', text: 'watchEffect' },
      { key: 'C', text: 'computed' },
      { key: 'D', text: 'v-show' }
    ],
    answer: ['A', 'B'],
    score: 10
  },
  {
    id: 9,
    type: 'single',
    title: 'Vue 3 中用于跨组件传递数据、避免 prop 逐级透传的 API 是？',
    options: [
      { key: 'A', text: 'provide / inject' },
      { key: 'B', text: 'props / emit' },
      { key: 'C', text: 'slot' },
      { key: 'D', text: 'mixin' }
    ],
    answer: ['A'],
    score: 10
  },
  {
    id: 10,
    type: 'single',
    title: '要让 Pinia 在 Vue 应用中生效，需要在 main.ts 中执行哪一步？',
    options: [
      { key: 'A', text: 'app.use(createPinia())' },
      { key: 'B', text: 'app.config.globalProperties.$pinia' },
      { key: 'C', text: 'new Pinia().install(app)' },
      { key: 'D', text: '无需任何配置' }
    ],
    answer: ['A'],
    score: 10
  }
]

/** 考试总时长（秒） */
export const EXAM_DURATION = 30 * 60
