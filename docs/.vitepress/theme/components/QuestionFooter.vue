<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import MasteryTracker from './MasteryTracker.vue'

const { frontmatter, page } = useData()

// 有 category 且不是分类索引页的，视为题目页，自动在其底部追加掌握度标记
const isQuestion = computed(() => {
  const path = String(page.value.relativePath || '')
  return Boolean(frontmatter.value.category) && !path.endsWith('index.md')
})
</script>

<template>
  <div v-if="isQuestion">
    <MasteryTracker />
  </div>
</template>
