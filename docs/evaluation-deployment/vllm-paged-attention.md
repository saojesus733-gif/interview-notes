---
title: vLLM 的 PagedAttention 解决什么问题？
category: 评估与部署
tags: [vLLM, PagedAttention, 推理优化, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

vLLM 为什么吞吐比原生推理高好几倍？PagedAttention 到底解决了什么问题？

## 核心答案

**痛点：KV Cache 的显存浪费**。

1. 传统推理服务为每个请求**按最大输出长度预分配连续显存**存 KV Cache——实际生成往往远短于预分配；
2. 加上内部碎片与预留浪费，有研究统计显存有效利用率可能只有 20%~40%——**大部分显存闲着，batch 就开不大**；
3. LLM 推理是显存带宽受限的，batch 大小直接决定吞吐——显存浪费 = 吞吐浪费。

**PagedAttention 的解法（借鉴操作系统虚拟内存分页）**：

1. 把 KV Cache 切成固定大小的 **block（物理块）**，逻辑上连续、物理上按需分配；
2. 生成变长时按需追加块，不预留最大长度——碎片与预留浪费趋近于零；
3. 附带能力：相同前缀的 block **跨请求共享**（prefix caching 的基础）、写时复制（COW）。

**收益**：显存利用率大幅提升 → 同卡能跑更大 batch → 吞吐提升数倍。注意：它优化的是**显存管理**，不是单 token 计算速度。

## 深度解析

- 完整的 vLLM 吞吐故事 = PagedAttention（显存）+ Continuous Batching（调度）+ 前缀共享（复用），三者叠加——面试按这个结构讲（呼应推理吞吐优化题）；
- 雷区：说 PagedAttention 让"单请求更快"——它主要提升**吞吐**，单请求延迟收益有限；
- 追问预判："其他加速点？"→ 量化、投机解码、CUDA kernel 优化（呼应推理优化分层）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [如何优化 LLM 推理吞吐量](/system-design/inference-throughput)
- [LLM 推理性能优化（模型层）](/evaluation-deployment/inference-optimization)
- [KV Cache](/llm-basics/kv-cache)
