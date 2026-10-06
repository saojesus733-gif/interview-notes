---
title: LLM 应用框架选型对比
category: 框架
tags: [框架选型, LangChain, LangGraph, Spring AI]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

做 LLM 应用有哪些主流框架路线？如何为项目选型？

## 核心答案

**四条主要路线**：

| 路线 | 优势 | 劣势 | 适合 |
| --- | --- | --- | --- |
| **LangChain** | 组件生态最全、原型速度最快 | 抽象层厚、深度定制要读源码 | 快速原型、标准 RAG |
| **LangGraph** | 图编排、循环/持久化/HITL 原生支持 | 学习曲线、Python 栈 | 复杂 Agent、多 Agent 系统 |
| **Spring AI** | Java 生态融合、企业级治理成熟 | Agent 编排生态较新 | Java 存量团队/企业级系统 |
| **裸 SDK + 自研** | 控制力最强、无黑盒、依赖最少 | 一切自己造，工程量大 | 强定制、强合规、长期核心系统 |

**选型五问**：

1. 团队主语言是什么？（Java → Spring AI 优先；Python → LangChain 系）
2. 流程是管道还是循环？（管道 → LCEL 够用；循环/人审 → LangGraph）
3. 是否要被框架抽象绑架？（核心长期资产可考虑自研薄层）
4. 生态需求：模型/向量库/追踪的适配是否现成？
5. 迁移成本：框架会不会锁死（换模型、换库的成本）？

**务实建议**：原型期用框架换速度；核心链路保一层自己的抽象（模型接口、状态定义），任何框架可替换。

## 深度解析

- 框架的价值 = 组件复用 + 最佳实践固化；代价 = 抽象泄漏时的调试成本与升级绑车。判断标准是团队对「黑盒深度」的容忍度；
- 观测体系（LangSmith / Langfuse / 自建）应在选型时一并考虑——生产排障对 tracing 的依赖远高于对框架语法糖的依赖；
- 框架会过时，能力会沉淀：把「提示词资产、评估集、工具层、状态模型」做成框架无关的核心资产，才是长期主义。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Spring AI 框架的主要优势](/frameworks/spring-ai)
- [LangGraph 与 LangChain 的关系与差异](/frameworks/langgraph-vs-langchain)
- [开源模型 vs 闭源模型选型](/llm-basics/open-vs-closed-source-models)
