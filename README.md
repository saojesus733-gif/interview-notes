# 面试八股文知识库

基于 VitePress 的个人面试知识库：八股文整理 + 真实面经 + 全文搜索 + 随机抽题 + 掌握度标记。纯静态，无后端。

## 使用

```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 构建到 docs/.vitepress/dist
npm run preview  # 本地预览构建产物
```

## 部署（GitHub Pages）

1. 把仓库推到 GitHub（分支 `main`）。
2. 修改 `docs/.vitepress/config.mts` 顶部的 `githubUser` / `repo` 为你的用户名与仓库名。
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
4. push 后自动构建部署，站点地址为 `https://<用户名>.github.io/<仓库名>/`。

## 新增一道题目

在对应分类目录（如 `docs/network/`）新建 `.md`，按模板填写：

```markdown
---
title: TCP 三次握手
category: 计算机网络          # 与分类目录对应
tags: [TCP, 网络, 面试高频]
importance: 3                # 1~3，3 为面试高频
mastery: 未掌握              # 仅作记录，实际掌握度存浏览器 localStorage
source: 字节跳动一面
---

## 问题

## 核心答案

## 深度解析

## 我的理解

## 关联题目
- [相关题目](相对链接)
```

保存后自动进入：侧边栏（需在 config.mts 登记）、本地搜索、随机抽题、标签索引、统计面板。页面底部自动出现掌握度标记按钮。

## 功能说明

| 功能 | 位置 | 说明 |
| --- | --- | --- |
| 全文搜索 | 顶栏 | VitePress 本地搜索（mini-search） |
| 标签索引 | 各分类 index.md | `<TagIndex category="分类名" />` 按标签聚合 |
| 随机抽题 | /random | `<RandomQuestion />`，按 category/tags/importance 筛选 |
| 掌握度标记 | 每道题底部 | `<MasteryTracker />`（题目页自动追加），localStorage key = `iq-mastery` |
| 错题本 | /review | `<ReviewList />` 未掌握/模糊清单，按重要度排序 |
| 模拟面试 | /mock-interview | `<MockInterview />` 倒计时作答 + 自评写入掌握度 |
| 复习统计 | /stats | `<StatsPanel />` 总题数/已掌握/模糊/未掌握 + 分类进度条 |

题库数据由 `docs/.vitepress/data/questions.data.ts` 通过 `createContentLoader` 在构建时生成（含每题的「问题」「核心答案」正文提取），全部在浏览器本地运行，无后端。

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts              # 站点配置（导航/侧边栏/搜索等）
│   ├── data/questions.data.ts  # createContentLoader 生成题库数据
│   └── theme/
│       ├── index.ts            # 自定义主题：注册组件 + doc-after 追加掌握度
│       ├── custom.css          # 阅读优先样式
│       └── components/
│           ├── RandomQuestion.vue
│           ├── MasteryTracker.vue
│           ├── StatsPanel.vue
│           ├── TagIndex.vue
│           └── QuestionFooter.vue
├── llm-basics/ prompt-engineering/ agent-architecture/    # AI 题库
├── agent-memory-tools/ rag/ frameworks/ evaluation-deployment/
├── scenarios/                  # 场景实战题
├── coding/ training/ behavioral/                        # 手写题/训练对齐/行为面
├── system-design/              # LLM 系统设计与工程实践
├── ai/                         # AI 应用自整理题
├── network/  os/  database/  language/  algorithm/      # 计算机基础
├── interview/                  # 真实面经
├── random.md                   # 随机抽题
├── review.md                   # 错题本（未掌握/模糊清单）
├── mock-interview.md           # 模拟面试（倒计时自评）
├── stats.md                    # 复习统计
└── index.md                    # 首页
```

> 各 AI 题库分类的 index.md 内含「题目 / 重要程度 / 标签」表格，可直接当分类目录使用。

