---
title: 手写 Scaled Dot-Product Attention
category: 手写编程
tags: [手写题, Attention, Transformer]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

用 PyTorch 手写单头 Scaled Dot-Product Attention（带因果掩码），并解释每一行在做什么。

## 核心答案

1. **公式**：Attention(Q, K, V) = softmax(QKᵀ / √d_k + mask) · V；
2. **四步**：算相似度（Q·K 点积）→ 缩放（除 √d_k 稳定梯度）→ 掩码（未来位置置 -inf，softmax 后为 0）→ 加权求和 V；
3. **形状**：Q/K/V 均为 (batch, seq, d_k)，输出 (batch, seq, d_k)。

## 深度解析

参考实现（PyTorch）：

```python
import torch, torch.nn.functional as F

def attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = Q @ K.transpose(-2, -1) / d_k ** 0.5   # (b, seq, seq) 相似度矩阵
    if mask is not None:                            # 因果掩码: 位置j>i不可见
        scores = scores.masked_fill(mask == 0, float("-inf"))
    weights = F.softmax(scores, dim=-1)             # 每行归一化成注意力分布
    return weights @ V                              # 按权重聚合 V
# 因果掩码构造: 下三角为1
# mask = torch.tril(torch.ones(seq, seq)).unsqueeze(0)
```

- 逐行追问点：为什么除 √d_k（防点积过大 softmax 饱和）；mask 用 -inf 而不是 0（softmax 后必须精确为 0 权重）；`dim=-1` 的 softmax 是对"每个 query 对所有 key"归一化；
- 多头延伸：把 Q/K/V 线性投影到 h 个 d_k/h 子空间，各自 attention 后拼接再投影——外层再加一个 reshape/循环即可；
- 追问：KV Cache 情况下这个函数怎么变？→ K/V 只 append 新 token 的行，Q 只有一步，scores 形状变成 (b, 1, seq_total)。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Attention 机制](/llm-basics/attention-mechanism)
- [KV Cache](/llm-basics/kv-cache)
