<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { data as questions } from '../../data/questions.data'
import { loadMastery, saveMastery, normKey, type MasteryMap } from './masteryStore'

const category = ref('全部')
const tag = ref('全部')
const minImportance = ref(0)
const onlyUnmastered = ref(false)
const current = ref(0)
const showAnswer = ref(false)
const loaded = ref(false)

let mastery: MasteryMap = {}
onMounted(() => {
  mastery = loadMastery()
  loaded.value = true
  window.addEventListener('keydown', onHotkey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onHotkey)
})

// 快捷键：空格 = 显示/收起答案，N = 下一题
function onHotkey(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  if (t && ['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) return
  if (!loaded.value || !currentQuestion.value) return
  if (e.code === 'Space') {
    e.preventDefault()
    showAnswer.value = !showAnswer.value
  } else if (e.key === 'n' || e.key === 'N') {
    next()
  }
}

const categories = computed(() => ['全部', ...Array.from(new Set(questions.map((q) => q.category)))])
const tags = computed(() => {
  const pool = category.value === '全部' ? questions : questions.filter((q) => q.category === category.value)
  return ['全部', ...Array.from(new Set(pool.flatMap((q) => q.tags)))]
})

const filtered = computed(() =>
  questions.filter((q) => {
    if (category.value !== '全部' && q.category !== category.value) return false
    if (tag.value !== '全部' && !q.tags.includes(tag.value)) return false
    if (q.importance < minImportance.value) return false
    if (onlyUnmastered.value && mastery[normKey(q.url)] === '已掌握') return false
    return true
  })
)

const currentQuestion = computed(() => filtered.value[current.value])
const masteryBadge = computed(() => {
  if (!loaded.value || !currentQuestion.value) return 'unset'
  const v = mastery[normKey(currentQuestion.value.url)]
  if (v === '已掌握') return 'mastered'
  if (v === '模糊') return 'fuzzy'
  if (v === '未掌握') return 'unmastered'
  return 'unset'
})
const masteryText = computed(() => {
  const map: Record<string, string> = { mastered: '已掌握', fuzzy: '模糊', unmastered: '未掌握', unset: '尚未标记' }
  return map[masteryBadge.value]
})

function next() {
  if (filtered.value.length === 0) return
  current.value = Math.floor(Math.random() * filtered.value.length)
  showAnswer.value = false
}
function pick(c: string) {
  category.value = c
  tag.value = '全部'
  current.value = 0
  showAnswer.value = false
}
</script>

<template>
  <div class="iq-card random-question">
    <div class="filters">
      <select v-model="category" @change="pick(category)">
        <option v-for="c in categories" :key="c" :value="c">分类：{{ c }}</option>
      </select>
      <select v-model="tag">
        <option v-for="t in tags" :key="t" :value="t">标签：{{ t }}</option>
      </select>
      <select v-model.number="minImportance">
        <option :value="0">重要度：不限</option>
        <option :value="1">≥ 1 星</option>
        <option :value="2">≥ 2 星</option>
        <option :value="3">≥ 3 星（高频）</option>
      </select>
      <label class="iq-muted">
        <input v-model="onlyUnmastered" type="checkbox" />
        排除已掌握
      </label>
    </div>

    <div v-if="!loaded || !currentQuestion" class="iq-muted" style="padding: 24px 0">
      {{ loaded ? '当前筛选条件下没有题目，请调整筛选。' : '正在加载题库…' }}
    </div>

    <div v-else>
      <div class="meta">
        <span class="tag-chip">{{ currentQuestion.category }}</span>
        <span v-for="t in currentQuestion.tags" :key="t" class="tag-chip">{{ t }}</span>
        <span class="iq-muted">重要度 {{ '★'.repeat(currentQuestion.importance) }}</span>
        <span v-if="currentQuestion.source" class="iq-muted">来源：{{ currentQuestion.source }}</span>
        <span class="mastery-badge" :class="masteryBadge">{{ masteryText }}</span>
      </div>

      <h3 class="question-title">{{ currentQuestion.title }}</h3>
      <div class="question-body" v-html="currentQuestion.question"></div>

      <div class="actions">
        <button class="iq-btn primary" @click="showAnswer = !showAnswer">
          {{ showAnswer ? '收起答案' : '显示答案' }}
        </button>
        <button class="iq-btn" @click="next">下一题 →</button>
        <span class="iq-muted">本题库共 {{ filtered.length }} 题 · 快捷键：空格=显示/收起答案，N=下一题</span>
      </div>

      <div v-if="showAnswer" class="answer">
        <div class="answer-body" v-html="currentQuestion.answer"></div>
        <a :href="withBase(currentQuestion.url)" class="iq-muted">查看完整题目页 →</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}
.filters select {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}
.question-title {
  margin: 12px 0 8px;
  font-size: 20px;
}
.question-body :deep(p) {
  margin: 6px 0;
}
.answer {
  margin-top: 16px;
  padding: 16px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
}
.answer-body :deep(ul) {
  padding-left: 20px;
}
.actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
}
</style>
