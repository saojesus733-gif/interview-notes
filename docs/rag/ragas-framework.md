---
title: RAGAS 评估框架怎么用？
category: RAG
tags: [RAGAS, 评估, RAG]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

听说过 RAGAS 这类 RAG 自动评估框架吗？它的指标怎么算出来的？实际项目里怎么用？

## 核心答案

**RAGAS 是什么**：RAG 自动评估框架——用 LLM（LLM-as-a-Judge）代替人工，对 RAG 的检索与生成质量按标准指标打分。

**核心指标与所需输入**：

| 指标 | 衡量什么 | 需要的输入 |
| --- | --- | --- |
| Faithfulness 忠实度 | 答案是否忠于检索内容（有没有编） | 问题、答案、contexts |
| Answer Relevance | 答案是否切题 | 问题、答案 |
| Context Precision | 检回内容里相关的排得靠不靠前 | 问题、contexts、标准答案 |
| Context Recall | 该检到的信息覆盖了多少 | 问题、contexts、标准答案 |

**使用流程**：准备评估集（问题 / 生成的答案 / 检索到的 contexts / 参考答案）→ 跑 RAGAS 得到指标 → 按"检索指标低 vs 生成指标低"归因优化 → 每次改动回归。

**局限**：Judge 本身有偏差（长度偏好、自我偏好），分数用于**相对比较与回归**，要人工抽检校准，不做绝对结论。

## 深度解析

- 指标 → 优化动作的映射是面试亮点：Context Recall 低 → 切分/Embedding/混合检索；Context Precision 低 → Rerank；Faithfulness 低 → Prompt 约束与校验（呼应评估指标详解）；
- 实践建议：RAGAS 指标与业务指标（解决率/采纳率）同板汇报，离线自动评估 + 线上人工反馈双轨；
- 雷区：把 RAGAS 分数当绝对真理对外承诺；评估集太小（<30 条）导致指标抖动。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [RAG 系统的评估指标](/rag/rag-evaluation-metrics)
- [Context Precision / Recall 检索侧指标详解](/evaluation-deployment/context-precision-recall)
- [LLM-as-a-Judge 的原理与偏差](/evaluation-deployment/llm-as-a-judge)
