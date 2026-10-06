// 掌握度数据统一读写：规范化 key（题目页路径统一去掉 .md，与题库数据 url 一致）
export const MASTERY_KEY = 'iq-mastery'
// 间隔重复调度：key -> 下次应复习的时间戳（ms）
export const SCHEDULE_KEY = 'iq-review'

export type MasteryMap = Record<string, string>
export type ScheduleMap = Record<string, number>

// 各掌握度等级的下次复习间隔（天）
export const SCHEDULE_INTERVALS: Record<string, number> = {
  未掌握: 1,
  模糊: 3,
  已掌握: 7
}

export function normKey(url: string): string {
  return url.endsWith('.md') ? url.slice(0, -3) : url
}

export function loadMastery(): MasteryMap {
  try {
    const raw = JSON.parse(localStorage.getItem(MASTERY_KEY) || '{}')
    // 兼容历史数据里带 .md 的 key
    const out: MasteryMap = {}
    for (const [k, v] of Object.entries(raw)) out[normKey(k)] = String(v)
    return out
  } catch {
    return {}
  }
}

export function saveMastery(m: MasteryMap) {
  localStorage.setItem(MASTERY_KEY, JSON.stringify(m))
  window.dispatchEvent(new CustomEvent('iq-mastery-changed'))
}

export function loadSchedule(): ScheduleMap {
  try {
    const raw = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || '{}')
    const out: ScheduleMap = {}
    for (const [k, v] of Object.entries(raw)) out[normKey(k)] = Number(v)
    return out
  } catch {
    return {}
  }
}

export function saveSchedule(s: ScheduleMap) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(s))
  window.dispatchEvent(new CustomEvent('iq-schedule-changed'))
}

// 标记某题后，按等级排定下次复习时间
export function scheduleNext(key: string, level: string, from = Date.now()) {
  const days = SCHEDULE_INTERVALS[level] ?? 1
  const s = loadSchedule()
  s[normKey(key)] = from + days * 86400000
  saveSchedule(s)
}

// 取消标记时同时移除调度
export function removeSchedule(key: string) {
  const s = loadSchedule()
  delete s[normKey(key)]
  saveSchedule(s)
}
