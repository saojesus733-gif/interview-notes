<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { data as questions } from '../../data/questions.data'
import { loadMastery, normKey, type MasteryMap } from './masteryStore'

const mastery = ref<MasteryMap>({})

function load() {
  mastery.value = loadMastery()
}
onMounted(() => {
  load()
  window.addEventListener('storage', load)
  window.addEventListener('iq-mastery-changed', load)
})
onUnmounted(() => {
  window.removeEventListener('storage', load)
  window.removeEventListener('iq-mastery-changed', load)
})

const total = computed(() => questions.length)
const countOf = (v: string) => Object.values(mastery.value).filter((x) => x === v).length
const mastered = computed(() => countOf('已掌握'))
const fuzzy = computed(() => countOf('模糊'))
const unmastered = computed(() => countOf('未掌握'))
const marked = computed(() => mastered.value + fuzzy.value + unmastered.value)
const progress = computed(() => (total.value === 0 ? 0 : Math.round((mastered.value / total.value) * 100)))

const categories = computed(() => {
  const map = new Map<string, { total: number; mastered: number; fuzzy: number; unmastered: number }>()
  for (const q of questions) {
    const entry = map.get(q.category) || { total: 0, mastered: 0, fuzzy: 0, unmastered: 0 }
    entry.total++
    const v = mastery.value[normKey(q.url)]
    if (v === '已掌握') entry.mastered++
    else if (v === '模糊') entry.fuzzy++
    else if (v === '未掌握') entry.unmastered++
    map.set(q.category, entry)
  }
  return Array.from(map.entries()).map(([name, s]) => ({ name, ...s }))
})
</script>

<template>
  <div class="stats-panel">
    <div class="summary">
      <div class="stat-card">
        <div class="num">{{ total }}</div>
        <div class="label">总题数</div>
      </div>
      <div class="stat-card green">
        <div class="num">{{ mastered }}</div>
        <div class="label">已掌握</div>
      </div>
      <div class="stat-card amber">
        <div class="num">{{ fuzzy }}</div>
        <div class="label">模糊</div>
      </div>
      <div class="stat-card red">
        <div class="num">{{ unmastered }}</div>
        <div class="label">未掌握</div>
      </div>
      <div class="stat-card">
        <div class="num">{{ progress }}%</div>
        <div class="label">掌握率（按总题数）</div>
      </div>
    </div>

    <p class="iq-muted">
      已标记 {{ marked }} / {{ total }} 题。数据保存在浏览器 localStorage（key: iq-mastery），不上传服务器。
    </p>

    <div class="overall-bar iq-bar">
      <span class="seg-mastered" :style="{ width: (mastered / (total || 1)) * 100 + '%' }"></span>
      <span class="seg-fuzzy" :style="{ width: (fuzzy / (total || 1)) * 100 + '%' }"></span>
      <span class="seg-unmastered" :style="{ width: (unmastered / (total || 1)) * 100 + '%' }"></span>
    </div>

    <h3>各分类进度</h3>
    <div v-for="c in categories" :key="c.name" class="cat-row">
      <div class="cat-head">
        <strong>{{ c.name }}</strong>
        <span class="iq-muted">
          {{ c.mastered }} 掌握 / {{ c.fuzzy }} 模糊 / {{ c.unmastered }} 未掌握 / 共 {{ c.total }} 题
        </span>
      </div>
      <div class="iq-bar">
        <span class="seg-mastered" :style="{ width: (c.mastered / (c.total || 1)) * 100 + '%' }"></span>
        <span class="seg-fuzzy" :style="{ width: (c.fuzzy / (c.total || 1)) * 100 + '%' }"></span>
        <span class="seg-unmastered" :style="{ width: (c.unmastered / (c.total || 1)) * 100 + '%' }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.stat-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  background: var(--vp-c-bg);
}
.stat-card .num {
  font-size: 28px;
  font-weight: 700;
}
.stat-card .label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}
.stat-card.green .num { color: #16a34a; }
.stat-card.amber .num { color: #d97706; }
.stat-card.red .num { color: #dc2626; }
.overall-bar {
  margin: 12px 0 24px;
}
.cat-row {
  margin-bottom: 14px;
}
.cat-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
</style>
