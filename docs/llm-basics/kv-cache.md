---
title: KV Cache
category: LLM 基础
tags: [KV Cache, 推理优化, LLM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

什么是 KV Cache？它为什么能加速推理？显存占用如何估算？

## 核心答案

- **是什么**：自回归生成时，每生成一个新 token 都要对「整段前文」算注意力。KV Cache 把每个历史 token 在每层的 Key、Value 缓存下来，下一步直接复用，不必重算。
- **为什么能加速**：没有 KV Cache 时，生成长度为 n 的回答需要重复计算 O(n²) 级别的注意力；有缓存后每个新 token 只需计算自身的 Q 与缓存 K/V 的交互，生成复杂度从「每步重算全序列」降为「每步只算增量」。
- **代价**：用显存换时间。显存占用估算公式（近似）：

```text
KV Cache 显存 ≈ 2 × 层数 × KV头数 × 每头维度 × 序列长度 × batch × 每参数字节数
```

- **缓解手段**：GQA/MQA（多个 Q 头共享 K/V 头，成倍压低缓存）、量化 KV Cache、滑动窗口注意力、Prefix Cache（相同前缀跨请求复用）。

## 深度解析

- 生成阶段（Decode）的瓶颈通常不是算力而是**显存带宽**：每步要把全部权重和 KV Cache 读一遍，只算一个 token，「带宽受限」。这也是 continuous batching 能提升吞吐的原因——一批请求分摊一次权重读取。
- Prefill（处理 prompt）阶段是计算受限，Decode 阶段是带宽受限，两者的优化策略不同；现代推理引擎（vLLM 等）把两阶段分开调度。
- KV Cache 显存随序列长度线性增长，长上下文场景下它经常比权重本身还占显存——这是「长上下文贵」的直接原因之一。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Attention 机制](/llm-basics/attention-mechanism)
- [推理性能优化](/evaluation-deployment/inference-optimization)
- [上下文窗口与长上下文](/llm-basics/context-window-long-context)
