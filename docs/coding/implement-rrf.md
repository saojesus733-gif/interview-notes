---
title: 手写 RRF 融合函数
category: 手写编程
tags: [手写题, RRF, 混合检索, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

现场手写一个 RRF（Reciprocal Rank Fusion）函数：输入多路检索结果（每路是有序文档 ID 列表），输出融合排序后的列表。

## 核心答案

1. **公式**：每个文档得分 = Σ 1/(k + rank_i)，rank 从 1 开始，k 常取 60；
2. **步骤**：遍历每路结果 → 按位置计算贡献分累加到该文档 → 按累计分降序排序输出；
3. **复杂度**：设共 N 个候选、R 路、每路 K 条，O(R·K) 累加 + O(N log N) 排序。

## 深度解析

参考实现（Python，面试写这个量正合适）：

```python
def rrf(result_lists, k=60):
    scores = {}
    for lst in result_lists:
        for rank, doc_id in enumerate(lst, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

# 两路结果: BM25 = [A, B, C], 向量 = [B, D, A]
# rrf([[A,B,C],[B,D,A]]) -> A 与 B 累加分最高, 排前
```

- 易错点：rank 忘记从 1 开始（公式定义）；两路分数没有共享同一个字典导致没融合；
- 变体：**加权 RRF**——每路乘一个权重 α 再累加，用于调节 BM25/向量两路的相对重要性；
- 追问：为什么用排名而不是原始分数融合？→ 各路分数量纲不同（BM25 分数与余弦相似度不可比），排名是无量纲的。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [混合检索（BM25 + 向量 + RRF）](/rag/hybrid-retrieval-bm25-rrf)
- [Rerank 重排序的必要性](/rag/rerank-bi-cross-encoder)
