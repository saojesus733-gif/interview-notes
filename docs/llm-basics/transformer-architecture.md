---
title: Transformer 架构
category: LLM 基础
tags: [Transformer, LLM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

介绍一下 Transformer 的整体架构，它相比 RNN 的关键优势是什么？

## 核心答案

- **整体结构**：原始 Transformer 是 Encoder-Decoder 架构；当前主流 LLM（GPT 系列）只用 Decoder 部分，即只含带掩码的自注意力的解码器堆叠。
- **核心组件**（每个 Decoder 层）：
  1. 带因果掩码的多头自注意力（Masked Multi-Head Attention）；
  2. 前馈网络（FFN，两层 MLP + 激活函数，占大部分参数量）；
  3. 残差连接 + 层归一化（每个子层外包 Residual + Norm）。
- **相比 RNN 的关键优势**：
  1. **并行训练**：RNN 必须按时间步串行，Transformer 整个序列可并行计算，训练效率高；
  2. **长程依赖**：任意两个 token 之间注意力路径长度为 O(1)，RNN 是 O(n)；
  3. **可扩展性**：堆叠层数与参数量随算力扩展稳定涨点，是大模型规模化的基础。

## 深度解析

- FFN 的作用常被低估：注意力负责「信息路由」（token 之间交换信息），FFN 负责逐位置的非线性变换与知识存储，有研究认为大量事实知识存储在 FFN 权重中。
- LayerNorm 位置有 Pre-Norm 与 Post-Norm 两种：现代大模型普遍用 Pre-Norm（残差主干更干净），训练更稳定。
- Encoder-Decoder 适合翻译类序列到序列任务（如 T5），Decoder-only 适合自回归生成（GPT），Encoder-only 适合理解类任务（BERT）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Attention 机制](/llm-basics/attention-mechanism)
- [KV Cache](/llm-basics/kv-cache)
- [位置编码（RoPE / ALiBi）](/llm-basics/positional-encoding-rope-alibi)
