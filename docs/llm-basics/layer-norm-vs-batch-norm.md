---
title: 为什么用 Layer Norm 不用 Batch Norm？多头注意力在做什么？
category: LLM 基础
tags: [LayerNorm, Transformer, LLM, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Transformer 为什么用 Layer Norm 而不是 Batch Norm？另外，多头注意力的"多头"到底有什么用——拆成多个头不是更麻烦吗？

## 核心答案

**LN vs BN**：

1. **BN 沿 batch 维归一化**，依赖同批次内样本的统计量——NLP 序列长度不一、padding 多，且大模型显存限制下 batch 很小，统计不稳定；
2. **LN 对单个样本的特征维归一化**，与 batch 大小、序列长度无关，训练与推理行为一致；
3. NLP 中每个 token 的特征维度相同（d_model），天然适合 LN；CV 里图像尺寸固定、空间位置统计有意义，所以 BN 在 CV 流行——是数据形态决定的选择，不是绝对优劣。

**多头的作用**：

1. 单头只有一个注意力分布，只能学一种"关注模式"；
2. 多头把 Q/K/V 投影到多个低维子空间，**每个头独立学一种关系**（有的看句法、有的看指代、有的看远距离依赖），最后拼接融合；
3. 计算量与同维度单头基本相同（降维后再拼回），换来的是表达能力的提升——本质是"多视角集成"。

## 深度解析

- 加分点：现代大模型普遍用 **RMSNorm**（LN 去掉均值中心化的简化版，计算更省）和 **Pre-Norm**（归一化放在残差分支内，训练更稳）；
- 雷区：把多头说成"为了并行/算得快"——多头的收益是表达能力，不是速度；
- 追问预判："MHA 之后为什么又有了 GQA/MQA？"→ 推理时 KV Cache 太大，多个 Q 头共享 K/V 头来压缩（呼应 KV Cache 题）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Attention 机制](/llm-basics/attention-mechanism)
- [Transformer 架构](/llm-basics/transformer-architecture)
- [KV Cache](/llm-basics/kv-cache)
