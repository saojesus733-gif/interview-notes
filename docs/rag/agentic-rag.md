---
title: Agentic RAG（RAG 与 Agent 的结合）
category: RAG
tags: [Agentic RAG, RAG, Agent, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 Agentic RAG？相比传统固定流程的 RAG，它强在哪里？

## 核心答案

- **传统 RAG 是固定流水线**：检索一次 → 拼 Prompt → 生成，无论问题难易都走同一条路。
- **Agentic RAG 把检索变成 Agent 可决策的工具**：由 Agent 动态决定——要不要检索、检索什么 query、查哪个数据源、结果够不够好要不要再来一轮。

**Agent 在 RAG 中的典型决策**：

1. **是否检索**：闲聊/常识问题直接答，省成本；
2. **查询改写与分解**：把模糊/复合问题拆成多个精准检索 query；
3. **路由**：多知识库/多工具（向量库、SQL、Web 搜索）之间选择与组合；
4. **迭代检索**：首轮结果不足时，基于已获信息改写 query 再查（Self/Iterative RAG 思想）；
5. **自检**：评估检索内容是否足以回答，不足则补充检索或声明无法回答。

**收益**：复杂/多跳问题的准确率显著提升、无效检索减少、可解释性更好。**代价**：延迟与 token 成本上升、链路复杂度提高——简单 FAQ 场景用固定 RAG 即可。

## 深度解析

- 多跳问题（“A 公司 CEO 的母校在哪个城市”）是固定 RAG 的死穴：单次检索覆盖不了推理链，Agentic 的迭代分解是针对性解法；
- 工程形态：把「检索」注册为工具（配合重排、多源路由的专用工具），Agent 用 ReAct/图编排驱动；LangGraph 这类框架很适合表达这种带循环的检索流程；
- 评估要覆盖「决策质量」：多查了几次（成本）、该查没查（召回损失）都要进入指标看板。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [RAG 的定义与核心价值](/rag/rag-definition-value)
- [Agent 的定义与四组件模型](/agent-architecture/agent-four-components)
- [LangGraph 的 StateGraph 三要素](/frameworks/langgraph-stategraph)
