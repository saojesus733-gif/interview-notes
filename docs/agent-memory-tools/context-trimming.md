---
title: Token 超限时的上下文裁剪策略
category: 记忆与工具
tags: [上下文裁剪, Token, 上下文工程, Agent]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

多轮对话累积超出上下文窗口时，有哪些裁剪策略？各自的取舍是什么？

## 核心答案

**裁剪优先级（从先到后）**：

1. **裁剪工具输出**：历史里的工具返回往往最大——只保留结论/关键字段，原始输出丢弃或外置；
2. **滚动摘要旧对话**：较早的轮次压缩成摘要，保留最近 N 轮原文（细节保精度）；
3. **截断最旧轮次**：摘要后仍超限，直接丢最旧的已摘要轮次；
4. **压缩 RAG 资料**：多路检索结果按相关性排序取 Top-K，每条截取关键片段；
5. **最后才动 System Prompt 与当前输入**：这两块影响行为契约与任务理解，尽量不动。

**保护性原则（无论怎么裁都要保）**：

- System Prompt 与当前用户输入完整保留；
- 对话中的「硬信息」（数字、ID、时间、承诺）要么保留原文，要么进结构化状态；
- 已做过的关键决策与未完成的任务（任务状态不因裁剪而丢失）。

**实现要点**：按 token 计数器动态触发，而不是固定轮数；裁剪是「构建 Memory 视图」的动作，不改动持久化的 Chat History。

## 深度解析

- 「截头」风险：开头常含任务约定与用户核心诉求，粗暴丢最旧轮次会导致模型「忘了自己是干什么的」——先摘要再丢，且摘要要显式包含任务目标。
- 长任务 Agent 中，工具结果是大头，很多框架（含 LangGraph 的 state trim / message filter 机制）都把「工具消息替换为摘要」作为标配手段（API 命名随版本有差异）。
- 裁剪本身有成本（摘要调用），要设触发阈值与缓存，避免每轮都重算摘要。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
- [Chat Memory 与 Chat History 的区别](/agent-memory-tools/chat-memory-vs-chat-history)
