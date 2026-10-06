---
title: Rerank 重排序的必要性（Bi-Encoder vs Cross-Encoder）
category: RAG
tags: [Rerank, Cross-Encoder, RAG, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

有了向量检索为什么还要 Rerank？Bi-Encoder 和 Cross-Encoder 的区别是什么？

## 核心答案

**两种模型架构**：

- **Bi-Encoder（双塔，Embedding 检索用）**：query 和文档**分别**独立编码成向量，再用相似度比对。文档可离线编码、在线只需算向量点积，**快**、可规模化；但两段文本没有「细粒度交互」，精度有上限；
- **Cross-Encoder（交叉编码器，Rerank 用）**：把 query 和文档**拼接成一个输入**送进模型，让 token 级交互后直接输出相关性分数。**准**得多；但每对 (query, doc) 都要跑一次模型，**慢**，无法全库使用。

**Rerank 的定位——两阶段漏斗**：

```text
全库（百万级）
  → 召回（Bi-Encoder/混合检索，快而粗）→ Top 50~100
  → Rerank（Cross-Encoder，慢而准）→ Top 5~10 进 Prompt
```

**为什么必要**：召回阶段为了快必然牺牲精度（ANN 是近似、双塔无交互）；Rerank 只对几十条精算，用小成本把「最相关的几条」顶到最前——直接提升进 Prompt 的内容质量，进而提升答案质量与忠实度。

## 深度解析

- 实测收益普遍显著：召回从 50 条精排到 10 条后，答案引用的资料命中率（Context Precision）明显上升；这是 RAG 提效性价比最高的一环之一；
- 延迟预算：Cross-Encoder 对 50 条的处理通常在百毫秒级，配合并发与批量推理可控；超时场景降级为「只用召回结果」；
- Rerank 模型选型与 Embedding 同源考量（领域适配、语言支持），主流有商用 API 与开源（bge-reranker 等）两类，注意与召回路的版本配套。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [混合检索（BM25 + 向量 + RRF）](/rag/hybrid-retrieval-bm25-rrf)
- [RAG 的评估指标](/rag/rag-evaluation-metrics)
