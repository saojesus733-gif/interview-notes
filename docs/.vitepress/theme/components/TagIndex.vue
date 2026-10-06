<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as questions } from '../../data/questions.data'

// 按分类聚合的标签索引：<TagIndex category="计算机网络" />
const props = defineProps<{ category: string }>()

const groups = computed(() => {
  const pool = questions.filter((q) => q.category === props.category)
  const map = new Map<string, typeof questions>()
  for (const q of pool) {
    for (const t of q.tags.length ? q.tags : ['未打标签']) {
      if (!map.has(t)) map.set(t, [])
      map.get(t)!.push(q)
    }
  }
  return Array.from(map.entries())
    .map(([tag, items]) => ({ tag, items }))
    .sort((a, b) => b.items.length - a.items.length)
})
</script>

<template>
  <div class="tag-index">
    <div v-for="g in groups" :key="g.tag" class="tag-group">
      <span class="tag-chip">{{ g.tag }}</span>
      <ul>
        <li v-for="q in g.items" :key="q.url">
          <a :href="withBase(q.url)">{{ q.title }}</a>
          <span class="iq-muted">
            {{ '★'.repeat(q.importance) }}
            <template v-if="q.source"> · {{ q.source }}</template>
          </span>
        </li>
      </ul>
    </div>
    <p v-if="groups.length === 0" class="iq-muted">该分类下还没有题目。</p>
  </div>
</template>

<style scoped>
.tag-group {
  margin-bottom: 14px;
}
.tag-group ul {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
}
.tag-group li {
  padding: 3px 0;
}
.tag-group li a {
  font-weight: 500;
}
</style>
