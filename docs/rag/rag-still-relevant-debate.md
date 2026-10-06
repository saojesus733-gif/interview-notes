---
title: 现在很多说法说 RAG 不能用了，你怎么看？（含 reranker 原理追问）
category: RAG
tags: [RAG, Reranker, Transformer, 面试真题]
importance: 2
mastery: 未掌握
source: 牛客网面经
---

## 问题

迅雷 Agent 一面（1h28min）第 2 题及追问：

- RAG，你怎么看的？现在很多说法说 RAG 不能用了，多方面分析一下，以及 LLM Wiki。
- 追问：那你觉得 reranker 对召回之后的优化到底能达到什么地步？底层原理是什么（从 transformer 的角度说一下）？重召回是以 topK 还是 topP 返回的？transformer 底层说一下。

## 核心答案

原文未提供答案。

## 深度解析

## 我的理解

（留空，结合 AIWear 的 RAG 经验填写：长尾知识/私有文档仍需检索，长上下文与 Agent 检索改变的是 RAG 的形态而不是取消它；reranker 上限受召回质量约束，topK 是工程默认、topP 属于生成采样概念——追问本身在考概念边界。）

## 关联题目

- [Rerank：Bi-Encoder 与 Cross-Encoder](/rag/rerank-bi-cross-encoder)
- [RAG 的定义与价值](/rag/rag-definition-value)
- [RAG vs 微调](/rag/rag-vs-finetune)
- [向量检索原理](/rag/vector-search-principle)

## 原始面经

> 节选自《迅雷 Agent一面》第 2 题（前面是意图识别与记忆深挖，后面是 chunk 分片联系）：
>
> 2.RAG，你怎么看的？ 现在很多说法说RAG不能用了，多方面分析一下，以及LLM Wiki。
>
> 追问，那你觉得reranker对召回之后的优化到底能达到什么地步？底层原理是什么（从transformer的角度说一下），重召回是以topK还是topP返回的？ transformer底层说一下。
>
> 来源：牛客网面经 https://www.nowcoder.com/discuss/932392798559432704
