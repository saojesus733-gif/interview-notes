import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import RandomQuestion from './components/RandomQuestion.vue'
import MasteryTracker from './components/MasteryTracker.vue'
import StatsPanel from './components/StatsPanel.vue'
import TagIndex from './components/TagIndex.vue'
import QuestionFooter from './components/QuestionFooter.vue'
import ReviewList from './components/ReviewList.vue'
import MockInterview from './components/MockInterview.vue'
import InterviewFetcher from './components/InterviewFetcher.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RandomQuestion', RandomQuestion)
    app.component('MasteryTracker', MasteryTracker)
    app.component('StatsPanel', StatsPanel)
    app.component('TagIndex', TagIndex)
    app.component('ReviewList', ReviewList)
    app.component('MockInterview', MockInterview)
    app.component('InterviewFetcher', InterviewFetcher)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 每道题页面底部自动追加掌握度标记组件
      'doc-after': () => h(QuestionFooter)
    })
  }
} satisfies Theme
