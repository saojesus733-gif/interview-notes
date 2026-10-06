---
title: Callback 与 Stream 的区别
category: 框架
tags: [Callback, Streaming, 可观测性, LangChain]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

框架里的 Callback 机制和 Stream 有什么区别？各用在什么场景？

## 核心答案

**一句话区分**：**Stream 是面向用户的前台数据流，Callback 是面向系统的后台事件钩子。**

| 维度 | Streaming | Callback |
| --- | --- | --- |
| 方向 | 框架 → 用户（增量数据） | 框架 → 应用（生命周期事件） |
| 内容 | token 增量、State 更新、自定义进度 | 开始/结束/出错/LLM 调用等事件 |
| 时效要求 | 实时推送（用户体验） | 异步处理即可 |
| 典型消费方 | 前端打字机、过程面板 | 日志、追踪（LangSmith）、指标埋点、计费 |
| 失败影响 | 直接影响用户可见输出 | 不影响主流程，最多丢观测数据 |

**Stream 的场景**：逐 token 输出回答、推送 Agent 执行进度。

**Callback 的场景**：

1. **可观测性**：每次 LLM 调用/工具执行的耗时与 token 统计上报 tracing 系统；
2. **审计**：记录完整调用链供合规审查；
3. **联动指标**：成功率、错误类型统计进监控大盘。

**配合使用**：同一次执行里，用户通过 Stream 看到「正在思考…」，系统通过 Callback 记录「第 3 次 LLM 调用耗时 1.2s、消耗 800 tokens」。

## 深度解析

- 两者本质是同一执行过程的两种「观察方式」：Stream 是有顺序保证的**数据通道**，Callback 是**事件广播**；
- 工程注意：Callback 里做重活（同步写远程 tracing）会拖慢主流程，应异步化；Stream 断连要有优雅降级（整段返回）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 的 Streaming API](/frameworks/langgraph-streaming)
- [LLM 应用的监控与质量退化检测](/evaluation-deployment/monitoring-quality-drift)
