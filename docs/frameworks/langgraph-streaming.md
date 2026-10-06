---
title: LangGraph 的 Streaming API 与前后端实时通信
category: 框架
tags: [LangGraph, Streaming, SSE, Agent]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

LangGraph 的流式输出怎么做？能把中间过程实时推给前端吗？

## 核心答案

**LangGraph 的多种流式模式**（mode 按版本可能略有差异）：

1. **values**：每步之后输出**完整 State**——适合观察全局状态演进；
2. **updates**：每步只输出**该节点的 State 增量**——带宽更省，看「这一步改了什么」；
3. **messages**：流式输出 **LLM 的 token 级增量**（含 Agent 内部每次模型调用的输出）——打字机效果的核心；
4. **custom**：节点内部通过 writer **主动上报自定义进度**（如「正在检索数据库…」「已完成 3/5 步」）。

**前后端实时通信组合**：

```text
LangGraph stream（token/进度事件）
  → 后端转成 SSE 推送
  → 前端 EventSource 逐条渲染
```

- token 流做「打字机」正文；custom/updates 事件做「过程面板」（显示正在调什么工具、哪一步完成）——Agent 可解释性的产品化落地。

## 深度解析

- 流式的价值不只是体验：Agent 执行可能长达数十秒，无流式时用户面对的是「白屏等待」，流失率与重复提交都会上升；
- 实现要点：后端持有一条 SSE 连接对应一次图执行；连接断开时图执行未必终止，要配合 checkpoint 恢复或主动取消；
- 与 Human-in-the-Loop 结合：interrupt 事件也通过流推给前端（弹出审批 UI），审批结果经新调用恢复图执行。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [流式响应与 SSE](/system-design/streaming-sse)
- [Callback 与 Stream 的区别](/frameworks/callback-vs-stream)
- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)
