<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { MASTERY_KEY, loadMastery, saveMastery, removeSchedule, scheduleNext, normKey } from './masteryStore'

const { page } = useData()

// 以题目页面路径（去掉 .md）作为唯一 key，改标题也不影响记录
const key = normKey('/' + String(page.value.relativePath || '').replace(/\\/g, '/'))

const LEVELS = [
  { value: '未掌握', cls: 'unmastered' },
  { value: '模糊', cls: 'fuzzy' },
  { value: '已掌握', cls: 'mastered' }
] as const

const current = ref<string | null>(null)
let mastery = loadMastery()

function setLevel(level: string) {
  if (current.value === level) {
    // 再次点击取消标记
    delete mastery[key]
    current.value = null
    removeSchedule(key)
  } else {
    mastery[key] = level
    current.value = level
    scheduleNext(key, level)
  }
  saveMastery(mastery)
}
function refresh() {
  mastery = loadMastery()
  current.value = mastery[key] || null
}
function onStorage(e: StorageEvent) {
  if (e.key === MASTERY_KEY) refresh()
}

onMounted(() => {
  refresh()
  window.addEventListener('storage', onStorage)
  window.addEventListener('iq-mastery-changed', refresh)
})
onUnmounted(() => {
  window.removeEventListener('storage', onStorage)
  window.removeEventListener('iq-mastery-changed', refresh)
})
</script>

<template>
  <div class="mastery-tracker">
    <span class="iq-muted label">掌握度：</span>
    <button
      v-for="lv in LEVELS"
      :key="lv.value"
      class="iq-btn"
      :class="{ active: current === lv.value }"
      @click="setLevel(lv.value)"
    >
      {{ lv.value }}
    </button>
    <span v-if="current" class="mastery-badge" :class="LEVELS.find((l) => l.value === current)?.cls">
      {{ current }}
    </span>
    <span v-else class="iq-muted">尚未标记</span>
  </div>
</template>

<style scoped>
.mastery-tracker {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}
.label {
  font-size: 13px;
}
</style>
