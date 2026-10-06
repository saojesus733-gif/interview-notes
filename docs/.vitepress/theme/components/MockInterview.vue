<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { data as questions } from '../../data/questions.data'
import { loadMastery, saveMastery, scheduleNext, normKey, type MasteryMap } from './masteryStore'

const category = ref('全部')
const seconds = ref(180)
const preferWeak = ref(true)

const pool = ref<typeof questions>([])
const current = ref(0)
const phase = ref<'idle' | 'thinking' | 'review'>('idle')
const left = ref(0)
const answered = ref(0)
const right = ref(0)
const wrong = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

let mastery: MasteryMap = loadMastery()
function record(level: string) {
  const q = pool.value[current.value]
  if (!q) return
  const k = normKey(q.url)
  mastery[k] = level
  saveMastery(mastery)
  scheduleNext(k, level)
}

const categories = computed(() => ['全部', ...Array.from(new Set(questions.map((q) => q.category)))])

function buildPool() {
  let pool0 = questions.filter((q) => category.value === '全部' || q.category === category.value)
  if (preferWeak.value) {
    const rank = (u: string) => {
      const v = mastery[normKey(u)]
      return v === '未掌握' ? 0 : v === '模糊' ? 1 : 2
    }
    pool0 = [...pool0].sort((a, b) => {
      const r = rank(a.url) - rank(b.url)
      return r !== 0 ? r : b.importance - a.importance
    })
  }
  return pool0
}

function start() {
  mastery = loadMastery()
  pool.value = buildPool()
  if (pool.value.length === 0) return
  current.value = 0
  answered.value = right.value = wrong.value = 0
  phase.value = 'thinking'
  left.value = seconds.value
  timer = setInterval(() => {
    if (left.value > 0) left.value--
    else stopTimer()
  }, 1000)
}
function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
  phase.value = 'review'
}
function assess(level: '已掌握' | '模糊' | '未掌握') {
  if (level === '已掌握') right.value++
  else wrong.value++
  record(level)
  if (current.value + 1 < pool.value.length) {
    current.value++
    phase.value = 'thinking'
    left.value = seconds.value
  } else {
    stopTimer()
  }
}
function nextQuestion() {
  if (current.value + 1 < pool.value.length) {
    current.value++
    phase.value = 'thinking'
    left.value = seconds.value
  } else {
    phase.value = 'idle'
  }
}
onUnmounted(stopTimer)

const q = computed(() => pool.value[current.value])
const mm = computed(() => String(Math.floor(left.value / 60)).padStart(2, '0'))
const ss = computed(() => String(left.value % 60).padStart(2, '0'))
</script>

<template>
  <div class="iq-card mock-interview">
    <p class="iq-muted">
      模拟真实面试：只显示题目并倒计时，自己口头作答后对照参考答案，如实自评（结果写入掌握度，可在错题本复习）。
    </p>

    <div v-if="phase === 'idle'" class="setup">
      <select v-model="category">
        <option v-for="c in categories" :key="c" :value="c">分类：{{ c }}</option>
      </select>
      <select v-model.number="seconds">
        <option :value="60">每题 1 分钟</option>
        <option :value="180">每题 3 分钟</option>
        <option :value="300">每题 5 分钟</option>
      </select>
      <label class="iq-muted"><input v-model="preferWeak" type="checkbox" /> 优先未掌握/模糊</label>
      <button class="iq-btn primary" @click="start">开始模拟（{{ pool.length || '—' }} 题在队列）</button>
    </div>

    <template v-else-if="q">
      <div class="meta">
        <span class="iq-muted"
          >第 {{ current + 1 }} / {{ pool.length }} 题 · 已自评：答上 {{ right }} / 没答上 {{ wrong }}</span
        >
        <span v-if="phase === 'thinking'" class="timer" :class="{ warn: left <= 20 }">{{ mm }}:{{ ss }}</span>
      </div>
      <div class="meta">
        <span class="tag-chip">{{ q.category }}</span>
        <span class="iq-muted">{{ '★'.repeat(q.importance) }}</span>
      </div>

      <h3 class="q-title">{{ q.title }}</h3>
      <div class="q-body" v-html="q.question"></div>

      <template v-if="phase === 'thinking'">
        <p class="iq-muted">（口头作答中……答完后点击下方按钮核对答案）</p>
        <button class="iq-btn primary" @click="stopTimer">我看完了，核对答案</button>
      </template>

      <template v-else>
        <div class="answer">
          <div class="answer-body" v-html="q.answer"></div>
          <a :href="withBase(q.url)" class="iq-muted">查看完整题目页 →</a>
        </div>
        <p class="iq-muted">如实自评（写入掌握度）：</p>
        <div class="actions">
          <button class="iq-btn" @click="assess('已掌握')">答上来了</button>
          <button class="iq-btn" @click="assess('模糊')">有点模糊</button>
          <button class="iq-btn" @click="assess('未掌握')">没答上</button>
          <button class="iq-btn" @click="nextQuestion">跳过（不自评）</button>
        </div>
      </template>
    </template>

    <div v-else class="done">
      <h3>本轮结束 🎉</h3>
      <p>共自评 {{ right + wrong }} 题：答上 {{ right }}，没答上/模糊 {{ wrong }}。结果已写入掌握度，去「错题本」查看复习清单。</p>
      <button class="iq-btn primary" @click="phase = 'idle'">再来一轮</button>
    </div>
  </div>
</template>

<style scoped>
.setup {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.setup select {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 8px 0;
}
.timer {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 600;
}
.timer.warn {
  color: #dc2626;
}
.q-title {
  font-size: 20px;
  margin: 8px 0;
}
.answer {
  margin-top: 16px;
  padding: 16px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.done {
  text-align: center;
  padding: 20px 0;
}
</style>
