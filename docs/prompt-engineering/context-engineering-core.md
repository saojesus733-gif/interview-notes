---
title: Context Engineering 的核心思路
category: Prompt 工程
tags: [上下文工程, Context Engineering, Agent, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 Context Engineering？它和 Prompt Engineering 是什么关系？

## 核心答案

- **定义**：Context Engineering 是**为模型在每一步决策时，构建「刚刚好」的上下文**的系统工程——决定哪些信息进入窗口、以什么形式、占多少预算。
- **与 Prompt Engineering 的关系**：Prompt Engineering 关注「单次指令怎么写」，Context Engineering 关注「整个系统在每个调用点喂给模型什么」。后者是前者的超集，是 Agent 时代的主要工程挑战。
- **三个核心操作**：
  1. **选择（Select）**：检索与当前步骤相关的信息（RAG、记忆召回、工具选择），宁缺勿滥；
  2. **压缩（Compress）**：摘要历史、裁剪工具输出，把宝贵的窗口留给关键信息；
  3. **隔离（Isolate）**：把子任务放进独立上下文执行（子 Agent / 分步调用），互不污染，只回传结论。
- **反面教材**：把所有历史、所有工具结果、所有检索内容无脑堆进窗口——token 爆炸、注意力稀释、效果反而下降（上下文腐烂）。

## 深度解析

- 长任务的上下文腐烂：Agent 跑得越久，历史中的错误观察、冗余工具结果越多，后续决策被污染；成熟做法是定期「整理上下文」——摘要 + 丢弃 + 结构化关键状态。
- 渐进式披露是选择策略的典型应用：先给目录/摘要，模型需要时再加载详情，避免一次性注入全量知识。
- 评估视角：上下文质量是 RAG/Agent 效果的第一变量，「检索错/检索少」比「模型弱」更常见——排障先查上下文。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [渐进式披露](/agent-architecture/progressive-disclosure)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
