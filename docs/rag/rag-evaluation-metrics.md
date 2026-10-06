---
title: RAG 系统的评估指标
category: RAG
tags: [评估, RAG, Faithfulness, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

RAG 系统怎么评估？Faithfulness 和 Answer Relevance 分别衡量什么？

## 核心答案

**分两层评估——检索层和生成层**，先定位问题在哪一层：

**检索层指标**（输入：query、检回的 chunks、标注的相关 chunks）：

- **Context Precision（上下文精确率）**：检回的内容里，相关内容排得有多靠前/占多大比例——衡量「召回的准不准、排序好不好」；
- **Context Recall（上下文召回率）**：标准答案需要的信息，有多大比例被检回的内容覆盖——衡量「该检到的检到了没」。

**生成层指标**（输入：query、检回的 chunks、生成的答案）：

- **Faithfulness（忠实度）**：答案是否忠于检回的资料——有没有「资料里没有却在编」，即事实性幻觉的度量；
- **Answer Relevance（答案相关性）**：答案是否切题回答了用户的问题——有没有答非所问、绕圈子；
- 端到端指标：**答案正确率**（与标注答案比对），最终对业务负责的数。

**评估方法**：人工标注金标准集（贵而准）+ 自动评估（LLM-as-a-Judge 按 rubric 打分，如 RAGAS 类框架，快而可扩展），两者结合：自动评估做回归与批量，人工抽检校准评估器。

## 深度解析

- 归因矩阵是答题亮点：Faithfulness 低 → 管生成（约束/校验）；Context Precision 低 → 管排序（Rerank）；Context Recall 低 → 管召回（切分/Embedding/混合检索）——不同指标对应不同优化动作。
- 指标要有业务锚点：比如要求 Faithfulness ≥ 0.9 才上线、Answer Relevance 低分样本必须人工复盘；
- 指标是分布不是单值：看 P50/P95 与坏案例，均值会掩盖局部灾难。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Context Precision / Recall 详解](/evaluation-deployment/context-precision-recall)
- [LLM 应用的评估体系](/evaluation-deployment/evaluation-system)
- [RAG 幻觉处理](/rag/rag-hallucination)
