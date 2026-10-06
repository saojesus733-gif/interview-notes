import { createContentLoader } from 'vitepress'
import type { ContentLoader } from 'vitepress'

export interface QuestionItem {
  title: string
  url: string
  category: string
  tags: string[]
  importance: number
  source: string
  question: string
  answer: string
}

function extractSection(src: string, heading: string): string {
  // 从 markdown 源码中提取 "## heading" 到下一个二级标题之间的内容
  const re = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'm')
  const m = src.match(re)
  return m ? m[1].trim() : ''
}

declare const data: QuestionItem[]
export { data }

export default createContentLoader(['/**/*.md'], {
  includeSrc: true,
  render: false,
  excerpt: false,
  transform(data) {
    return data
      .filter((page) => {
        const fm = page.frontmatter
        // 只收录题目页：有 category 且不是 index / 工具页 / 面经页
        return (
          fm.category &&
          !page.url.endsWith('/') &&
          !['/random', '/stats'].includes(page.url) &&
          !page.url.startsWith('/interview/')
        )
      })
      .map((page) => {
        const fm = page.frontmatter as Record<string, any>
        const question = extractSection(page.src || '', '问题') || (fm.title as string)
        const answer = extractSection(page.src || '', '核心答案')
        return {
          title: (fm.title as string) || page.src?.split('\n')[0] || page.url,
          url: page.url,
          category: fm.category as string,
          tags: (fm.tags as string[]) || [],
          importance: Number(fm.importance) || 0,
          source: (fm.source as string) || '',
          question,
          answer
        }
      })
      .sort((a, b) => b.importance - a.importance)
  }
} as ContentLoader)
