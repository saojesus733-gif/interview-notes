<template>
  <div class="fetcher">
    <p class="status">
      <span class="dot" :class="serviceOk ? 'on' : 'off'"></span>
      <template v-if="serviceOk">本地采集服务已连接</template>
      <template v-else>
        本地采集服务未启动 —— 请先在终端运行：
        <code>cd D:\codex_work\工具\newcoder-mcp-server && node interview-service.mjs</code>
      </template>
    </p>

    <input
      v-model="input"
      class="box"
      :disabled="busy"
      placeholder="粘贴牛客面经链接，或输入关键词（如：美团 Agent 面经）"
      @keyup.enter="submit"
    />
    <button class="btn" :disabled="busy || !serviceOk" @click="submit">
      {{ busy ? '处理中，请稍候…' : input.includes('nowcoder.com') ? '一键抓取入库' : '搜索牛客面经' }}
    </button>

    <p v-if="log" class="log" :class="{ err: isError }">{{ log }}</p>

    <ol v-if="results.length" class="results">
      <li v-for="(r, i) in results" :key="i">
        <a :href="r.url" target="_blank" rel="noreferrer">{{ r.title }}</a>
        <span class="meta">{{ [r.author, r.time].filter(Boolean).join(' · ') }}</span>
        <p class="summary">{{ r.summary }}</p>
        <button class="mini" :disabled="busy || !serviceOk" @click="archive(r.url, r.apiId)">抓取这篇入库</button>
      </li>
    </ol>

    <p v-if="success" class="done">
      ✅ 已入库 <code>{{ success.file }}</code>，站点已自动重建
      {{ success.previewRestarted ? '，预览已重启' : '' }}。刷新页面即可在
      <a href="/interview-notes/interview/">面经索引</a> 看到。
      想把这篇拆题进刷题题库的话，在 ZCode 里说一声即可。
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API = 'http://127.0.0.1:5174'
const input = ref('')
const busy = ref(false)
const serviceOk = ref(false)
const log = ref('')
const isError = ref(false)
const results = ref([])
const success = ref(null)

onMounted(async () => {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 3000)
    const r = await fetch(`${API}/api/health`, { signal: ctrl.signal })
    clearTimeout(t)
    serviceOk.value = r.ok
  } catch { serviceOk.value = false }
})

function say(msg, err = false) { log.value = msg; isError.value = err }

async function post(path, body, timeoutMs) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const r = await fetch(`${API}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: ctrl.signal,
    })
    const data = await r.json()
    if (!r.ok || data.ok === false) throw new Error(data.error || `HTTP ${r.status}`)
    return data
  } finally { clearTimeout(t) }
}

async function submit() {
  const v = input.value.trim()
  if (!v || busy.value) return
  success.value = null
  if (v.includes('nowcoder.com')) return archive(v, '')
  results.value = []
  busy.value = true
  say('正在搜索牛客（1-2 秒）…')
  try {
    const data = await post('/api/search', { query: v }, 60000)
    results.value = data.items
    say(data.items.length ? `找到 ${data.items.length} 条，点「抓取这篇入库」收进知识库` : '没有找到相关结果，换个关键词试试')
  } catch (e) { say('搜索失败：' + e.message, true) }
  busy.value = false
}

async function archive(url, apiId = '') {
  busy.value = true
  success.value = null
  say('正在抓取全文 → 存档 → 更新索引 → 重建站点，全程约 30 秒，请勿关闭页面…')
  try {
    const data = await post('/api/archive', { url, apiId }, 420000)
    if (data.skipped) { say(''); success.value = null; alert(data.message || '该帖已在库中，未重复入库') }
    else if (data.buildOk) { success.value = data; say('') }
    else say('已存档但站点构建失败：' + data.buildErr, true)
  } catch (e) { say('抓取失败：' + (e.name === 'AbortError' ? '超时，请检查服务是否还在运行' : e.message), true) }
  busy.value = false
}
</script>

<style scoped>
.fetcher { margin: 1rem 0; }
.status { font-size: 0.9rem; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
.dot.on { background: #10b981; }
.dot.off { background: #ef4444; }
.box { width: 100%; max-width: 640px; padding: 8px 12px; margin: 8px 8px 8px 0; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.btn { padding: 8px 18px; border-radius: 8px; border: none; background: var(--vp-c-brand-1); color: #fff; cursor: pointer; font-weight: 600; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.results { margin-top: 1rem; padding-left: 1.2rem; }
.results li { margin: 0.7rem 0; }
.meta { color: var(--vp-c-text-3); font-size: 0.85rem; margin-left: 8px; }
.summary { color: var(--vp-c-text-2); font-size: 0.85rem; margin: 4px 0; }
.mini { font-size: 0.85rem; padding: 4px 12px; border-radius: 6px; border: 1px solid var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: transparent; cursor: pointer; }
.mini:disabled { opacity: 0.5; }
.log { margin-top: 0.8rem; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 8px; font-size: 0.9rem; }
.log.err { color: #dc2626; }
.done { margin-top: 0.8rem; padding: 10px 14px; background: var(--vp-c-bg-soft); border-left: 3px solid #10b981; border-radius: 4px; font-size: 0.9rem; }
</style>
