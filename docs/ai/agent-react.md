---
title: Agent 的基本架构与 ReAct 模式
category: AI 应用
tags: [Agent, ReAct, LLM, AI 应用]
importance: 3
mastery: 未掌握
source: 自整理
---

## 问题

LLM Agent 由哪几部分组成？ReAct 模式是如何工作的？

## 核心答案

Agent 的四个基本组件：

1. **LLM（大脑）**：理解、推理与决策的核心；
2. **规划（Planning）**：任务拆解、子目标排序、反思重试；
3. **工具（Tools）**：调用搜索、代码执行、API 等扩展能力；
4. **记忆（Memory）**：短期（上下文）与长期（外部存储）。

**ReAct**（Reasoning + Acting）模式：推理与行动交替进行，循环执行：

```text
Thought（我要查今天的天气）
  → Action（调用 weather_api，参数：city=北京）
  → Observation（晴，25℃）
  → Thought（已拿到答案）
  → Final Answer（北京今天晴，25℃）
```

每一步由 LLM 决定下一步「想什么」或「做什么」，直到产出最终答案。相比只推理不行动的 CoT，ReAct 能与真实环境交互、获取外部信息并验证结果。

## 深度解析

- 循环控制：必须设最大轮数与终止条件，防止死循环与成本失控；
- 工具出错处理：Action 执行失败时把错误信息作为 Observation 回传，让模型自我修正（Self-Correction）；
- 规划模式：ReAct 是「边想边做」，Plan-and-Execute 则先整体规划再逐步执行，后者适合长任务、前者更灵活；
- 多 Agent 协作：常见主管-执行者（Supervisor/Worker）结构，或辩论/分工式协作，用消息传递共享状态。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Function Calling（工具调用）的完整流程](/ai/function-calling)
- [Agent 的记忆机制](/ai/agent-memory)
- [RAG（检索增强生成）的原理与流程](/ai/rag-pipeline)
