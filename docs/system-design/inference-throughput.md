---
title: 如何优化 LLM 推理吞吐量
category: 系统设计
tags: [推理优化, 吞吐量, 系统设计, 性能优化]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

自部署 LLM 服务时，如何从系统层面优化推理吞吐量？

## 核心答案

**先分清两阶段**：Prefill（处理输入，计算受限）与 Decode（逐 token 生成，显存带宽受限），优化策略不同。

**系统层手段（按性价比排序）**：

1. **Continuous Batching（连续批处理）**：不等一批请求全部完成，完成的请求退出、新请求随时插入——GPU 利用率成倍提升，是现代推理引擎（vLLM 等）的标配；
2. **Prefix / KV Cache 复用**：相同前缀（System Prompt、few-shot、长文档）跨请求复用 KV，省去重复 prefill——RAG 与 Agent 场景收益巨大；
3. **量化**：权重 INT8/INT4 降低显存占用 → 单卡塞更大模型或更大 batch，吞吐与成本双优（精度需评估）；
4. **并行策略**：大模型单卡放不下时用张量并行/流水线并行；多副本 + 负载均衡做水平扩展；
5. **投机解码**：小模型先草拟多个 token，大模型并行验证——接近原始质量的加速；
6. **调度与排队**：请求按优先级/长度调度，短请求不排队等长请求；
7. **业务侧分流**：能走 API/小模型/缓存的请求不进自建集群。

**指标看板**：TTFT（首 token 延迟）、TPOT（每 token 延迟）、吞吐（token/s/GPU）、P99 延迟——优化前先建立基线。

## 深度解析

- 吞吐与延迟是 trade-off：batch 越大吞吐越高，但单请求延迟上升；SLA 驱动下先定延迟上限，再在余量内最大化 batch；
- KV Cache 显存管理是吞吐的核心资源问题：分页管理（PagedAttention 思想）减少碎片，让显存利用率接近满载；
- 不要忽视「输入长度」这个变量：RAG 上下文越长 prefill 越贵，上下文工程直接就是推理成本工程。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [KV Cache](/llm-basics/kv-cache)
- [推理性能优化（模型层）](/evaluation-deployment/inference-optimization)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
