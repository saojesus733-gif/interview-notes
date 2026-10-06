<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { data as questions } from '../../data/questions.data'
import {
  MASTERY_KEY,
  SCHEDULE_KEY,
  loadMastery,
  loadSchedule,
  saveMastery,
  saveSchedule,
  scheduleNext,
  normKey,
  type MasteryMap,
  type ScheduleMap
} from './masteryStore'

const mastery = ref<MasteryMap>({})
const schedule = ref<ScheduleMap>({})
const importInput = ref<HTMLInputElement | null>(null)
const importMsg = ref('')

function load() {
  mastery.value = loadMastery()
  schedule.value = loadSchedule()
}
onMounted(() => {
  load()
  window.addEventListener('storage', load)
  window.addEventListener('iq-mastery-changed', load)
  window.addEventListener('iq-schedule-changed', load)
})
onUnmounted(() => {
  window.removeEventListener('storage', load)
  window.removeEventListener('iq-mastery-changed', load)
  window.removeEventListener('iq-schedule-changed', load)
})

const byNormKey = new Map(questions.map((q) => [normKey(q.url), q]))
const listOf = (level: string) =>
  questions
    .filter((q) => mastery.value[normKey(q.url)] === level)
    .sort((a, b) => b.importance - a.importance)

const unmastered = computed(() => listOf('未掌握'))
const fuzzy = computed(() => listOf('模糊'))
const markedCount = computed(
  () => Object.values(mastery.value).filter((v) => v === '已掌握' || v === '模糊' || v === '未掌握').length,
)

// ---- 今日待复习（间隔重复） ----
const due = computed(() => {
  const now = Date.now()
  return Object.entries(schedule.value)
    .filter(([, next]) => next <= now)
    .map(([key, next]) => ({ key, next, q: byNormKey.get(key) }))
    .filter((x) => !!x.q)
    .sort((a, b) => a.next - b.next)
})
function reviewPass(key: string) {
  mastery.value[key] = '已掌握'
  saveMastery(mastery.value)
  scheduleNext(key, '已掌握')
}
function reviewFail(key: string) {
  mastery.value[key] = '未掌握'
  saveMastery(mastery.value)
  scheduleNext(key, '未掌握')
}
function fmtDay(ts: number) {
  const d = Math.round((ts - Date.now()) / 86400000)
  return d <= 0 ? '今天' : `${d} 天后`
}

// ---- 导出 / 导入 ----
function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'interview-notes',
    mastery: loadMastery(),
    schedule: loadSchedule()
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `interview-mastery-${payload.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}
async function onImportFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    if (!data || typeof data !== 'object' || typeof data.mastery !== 'object') {
      throw new Error('格式不对')
    }
    // 规范化 key 后写入
    const m: MasteryMap = {}
    for (const [k, v] of Object.entries(data.mastery)) m[normKey(k)] = String(v)
    const s: ScheduleMap = {}
    if (typeof data.schedule === 'object' && data.schedule) {
      for (const [k, v] of Object.entries(data.schedule)) s[normKey(k)] = Number(v)
    }
    saveMastery(m)
    saveSchedule(s)
    load()
    importMsg.value = `导入成功：${Object.keys(m).length} 条掌握度记录。`
  } catch (err) {
    importMsg.value = '导入失败：文件不是有效的备份 JSON。'
  }
}
function clearAll() {
  if (!confirm('确定清空所有掌握度标记与复习计划？此操作不可恢复。')) return
  localStorage.removeItem(MASTERY_KEY)
  localStorage.removeItem(SCHEDULE_KEY)
  load()
  window.dispatchEvent(new CustomEvent('iq-mastery-changed'))
}
</script>

<template>
  <div class="review-list">
    <p class="iq-muted">
      已标记 {{ markedCount }} 题，已掌握 {{ Object.values(mastery).filter((v) => v === '已掌握').length }} 题。
      数据保存在浏览器 localStorage——<strong>换浏览器或清缓存会丢失</strong>，请定期导出备份。
      <button class="iq-btn" @click="exportData">导出备份</button>
      <button class="iq-btn" @click="importInput?.click()">导入备份</button>
      <input ref="importInput" type="file" accept="application/json,.json" style="display: none" @change="onImportFile" />
      <button class="iq-btn danger" @click="clearAll">清空全部</button>
      <span v-if="importMsg" class="import-msg">{{ importMsg }}</span>
    </p>

    <h3>今日该复习（{{ due.length }}）</h3>
    <p class="iq-muted">
      间隔重复：标记后自动排期——未掌握 1 天后重现，模糊 3 天后，已掌握 7 天后再抽查。
    </p>
    <ol class="review-items">
      <li v-for="d in due" :key="d.key">
        <template v-if="d.q">
          <a :href="withBase(d.q.url)">{{ d.q.title }}</a>
          <span class="iq-muted"> {{ '★'.repeat(d.q.importance) }} · {{ d.q.category }}</span>
          <span class="due-actions">
            <button class="iq-btn ok" @click="reviewPass(d.key)">通过了</button>
            <button class="iq-btn danger" @click="reviewFail(d.key)">没过</button>
          </span>
        </template>
        <template v-else>
          {{ d.key }} <span class="iq-muted">（题库中未找到，可能是已删除的题目）</span>
          <span class="due-actions">
            <button class="iq-btn" @click="reviewPass(d.key)">移出队列</button>
          </span>
        </template>
      </li>
    </ol>
    <p v-if="due.length === 0" class="iq-muted">今天没有到期的复习任务。新标记的题目会按间隔自动排期到这里。</p>

    <h3>未掌握（{{ unmastered.length }}）</h3>
    <ol class="review-items">
      <li v-for="q in unmastered" :key="q.url">
        <a :href="withBase(q.url)">{{ q.title }}</a>
        <span class="iq-muted"> {{ '★'.repeat(q.importance) }} · {{ q.category }}</span>
      </li>
    </ol>
    <p v-if="unmastered.length === 0" class="iq-muted">太棒了，没有标记为「未掌握」的题目。去随机刷题里继续检验吧。</p>

    <h3>模糊（{{ fuzzy.length }}）</h3>
    <ol class="review-items">
      <li v-for="q in fuzzy" :key="q.url">
        <a :href="withBase(q.url)">{{ q.title }}</a>
        <span class="iq-muted"> {{ '★'.repeat(q.importance) }} · {{ q.category }}</span>
      </li>
    </ol>
    <p v-if="fuzzy.length === 0" class="iq-muted">没有标记为「模糊」的题目。</p>
  </div>
</template>

<style scoped>
.review-items {
  padding-left: 20px;
}
.review-items li {
  padding: 3px 0;
}
.due-actions {
  margin-left: 8px;
  display: inline-flex;
  gap: 6px;
}
.due-actions .iq-btn {
  padding: 2px 10px;
  font-size: 12px;
}
.ok {
  color: #16a34a;
}
.danger {
  color: #dc2626;
}
.import-msg {
  margin-left: 8px;
  color: var(--vp-c-brand-1);
}
</style>
