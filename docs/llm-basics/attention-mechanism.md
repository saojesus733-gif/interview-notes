---
title: Attention 机制
category: LLM 基础
tags: [Attention, Transformer, LLM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

讲一下 Self-Attention 的计算过程，为什么要除以 √d_k？多头注意力在做什么？

## 核心答案

**Self-Attention 计算过程**（Scaled Dot-Product Attention）：

1. 每个 token 的向量 x 通过三个投影矩阵得到 Query、Key、Value；
2. 注意力权重 = softmax(QKᵀ / √d_k)，即每个 token 的 Q 与所有 token 的 K 做点积，衡量「我应该关注谁」；
3. 输出 = 权重加权求和 V，即按相关度聚合各 token 的信息。

**为什么除以 √d_k**：点积的方差与维度 d_k 成正比，维度大时点积值过大，softmax 进入饱和区、梯度接近 0；除以 √d_k 把方差拉回约 1，保持训练稳定。

**多头注意力（Multi-Head）**：把 Q/K/V 投影到 h 个低维子空间，各自独立做注意力再拼接。意义是让不同头关注不同类型的关系（有的头看句法、有的看指代、有的看远距离关联），扩大模型的表达能力。

## 深度解析

- 复杂度：自注意力对序列长度是 O(n²) 的计算与显存开销，这是长上下文昂贵的根源，也是各种高效注意力（稀疏/线性注意力、FlashAttention）要优化的对象。
- 因果掩码（Causal Mask）：Decoder 中把「未来位置」的注意力权重置为 -∞，保证自回归生成时不能偷看后文。
- FlashAttention 本质不改数学公式，而是优化显存读写（分块计算、减少 HBM 访问），在不牺牲精度的前提下提速省显存。
- KV Cache 相关的 MQA/GQA 是在「头」的维度做减法：多个 Query 头共享一组 K/V 头，压低推理显存。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Transformer 架构](/llm-basics/transformer-architecture)
- [KV Cache](/llm-basics/kv-cache)
- [位置编码（RoPE / ALiBi）](/llm-basics/positional-encoding-rope-alibi)
