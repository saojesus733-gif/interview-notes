---
title: LangGraph 与 LangChain 的关系与差异
category: 框架
tags: [LangGraph, LangChain, Agent, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

LangGraph 和 LangChain 是什么关系？为什么复杂 Agent 推荐用 LangGraph？

## 核心答案

**关系**：同一家公司（LangChain 团队）的互补产品——**LangChain 是组件库，LangGraph 是编排引擎**。LangGraph 可以独立使用，也可以与 LangChain 组件组合。

**差异对比**：

| 维度 | LangChain（Chain/LCEL） | LangGraph（StateGraph） |
| --- | --- | --- |
| 结构形态 | 线性管道（DAG，一去不回头） | 图（支持**环**、循环、分支） |
| 控制流 | 管道固定 | 条件边 + 循环，可表达任意流程 |
| 状态管理 | 管道间隐式传递 | 中心化 State + 持久化 checkpoint |
| 适合 | 简单链路：RAG 管道、批处理 | 复杂 Agent：循环决策、多 Agent、HITL |
| 恢复能力 | 弱 | 断点续跑、时间旅行、人工介入 |

**为什么复杂 Agent 推荐 LangGraph**：Agent 的本质是「循环 + 分支 + 可中断」，链式结构表达不了「执行-观察-再决策」的环；LangGraph 的 State + 条件边 + checkpoint 恰好把循环、状态持久化、Human-in-the-Loop 变成原生能力。（版本提示：官方文档已将 Agent 构建的重心放在 LangGraph，LangChain 侧重组件与集成。）

## 深度解析

- 演进逻辑：早期 LangChain Agent（ReAct 文本循环）黑盒难控 → 社区要求「看得见、控得住的循环」→ LangGraph 把控制流显式化为图。这个演进本身就是「Agent 演进为状态机」的注脚；
- 选型表达：简单链用 LCEL，复杂编排用 LangGraph，两者共享模型/工具/追踪生态，迁移成本不高。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 的 StateGraph 三要素](/frameworks/langgraph-stategraph)
- [为什么 Agent 最终会演进为状态机](/frameworks/agent-state-machine-evolution)
- [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
