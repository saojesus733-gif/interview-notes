---
title: LangChain 的核心定位与主要组件
category: 框架
tags: [LangChain, 框架, LLM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

LangChain 解决什么问题？它的核心组件有哪些？

## 核心答案

**定位**：LangChain 是 LLM 应用的**组件库与编排框架**——把「调模型、管提示、接数据、连工具」这些重复工程抽象成可复用组件，让开发者像搭积木一样组装 LLM 应用。

**主要组件**：

1. **Model I/O**：统一各模型提供商的调用接口（Chat Model / Embedding / 输出解析器）；
2. **Prompts**：提示模板管理（变量化、复用、few-shot 组装）；
3. **Retrieval（检索）**：文档加载、切分、Embedding、向量库对接、Retriever 抽象——RAG 的现成积木；
4. **Chains / LCEL**：用声明式管道把组件串联成链（见 LCEL 题）；
5. **Agents & Tools**：工具定义与 Agent 执行循环，让模型决策调用外部能力；
6. **Memory**：对话状态的维护抽象。

> 版本提示：LangChain 经历了拆包演进（langchain-core / langchain-community / 合作伙伴包），且官方将复杂 Agent 编排的重心转向 LangGraph——面试时建议说明「组件划分是概念性的，具体 API 随版本变化」。

## 深度解析

- LangChain 的价值在**生态与迁移成本**：几十家模型/向量库/文档加载器的适配开箱即用，原型速度极快；
- 争议点也要会说：过度抽象导致调试链路深、魔法多；生产复杂系统常「借鉴其抽象、裁剪使用」或换更薄的封装；
- 它与 LangGraph 是一家公司的互补产品：LangChain 管「组件」，LangGraph 管「编排」。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 与 LangChain 的关系与差异](/frameworks/langgraph-vs-langchain)
- [LCEL 表达式](/frameworks/lcel)
- [框架选型对比](/frameworks/framework-selection)
