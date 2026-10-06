---
title: Context Precision / Recall 检索侧指标详解
category: 评估与部署
tags: [评估, RAG, 检索, Context Precision]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

RAG 检索质量的 Context Precision 和 Context Recall 怎么理解和计算？

## 核心答案

**背景**：RAG 评估要拆开检索层与生成层，这两个指标专管**检索层**——衡量「放进 Prompt 的资料靠不靠谱」。

**Context Precision（上下文精确率）**：

- 问的是：**检回来的内容里，相关的有多少？相关的有没有排在前面？**
- 计算（简化）：对检回的 Top-K 逐条判断「是否与回答该问题相关」（人工标注或 Judge 判定），统计相关条目的占比；进阶版按排序加权——相关条目越靠前得分越高；
- 低 Precision 的后果：无关资料污染 Prompt → 模型被带偏、忠实度下降、token 浪费。

**Context Recall（上下文召回率）**：

- 问的是：**正确回答所需的信息，检回来的内容覆盖了多少？**
- 计算（简化）：以标注答案 / 标注相关文档为基准，看其中每条关键信息能否在检回内容中找到支撑，统计覆盖率；
- 低 Recall 的后果：模型缺料 → 答不全或开始编（幻觉）。

**优化对应关系**：

| 指标低 | 先查什么 |
| --- | --- |
| Precision 低 | 排序（Rerank）、过滤策略、chunk 质量 |
| Recall 低 | 切分（切碎了？）、Embedding/混合检索、query 改写 |

## 深度解析

- 两者常互相拉扯：放宽阈值召回更多 → Recall 升 Precision 降；Rerank 正是用来「召回放宽 + 精排收紧」的中间层；
- 指标计算依赖「相关性判定」，规模化用 LLM-as-a-Judge，但要用人工标注集校准 Judge；
- 与生成侧指标的闭环：Context 指标高但 Faithfulness 低 → 是生成端越界，不是检索的锅——分层归因才不冤枉优化方向。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [RAG 系统的评估指标](/rag/rag-evaluation-metrics)
- [Rerank 重排序的必要性](/rag/rerank-bi-cross-encoder)
