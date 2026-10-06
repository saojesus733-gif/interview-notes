---
title: LLM 推理性能优化（模型层）
category: 评估与部署
tags: [推理优化, 性能优化, KV Cache, LLM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

从模型与推理引擎层面，有哪些优化 LLM 推理性能的手段？

## 核心答案

**按优化对象分层**：

1. **显存与缓存**：
   - KV Cache 优化：GQA/MQA 压缩 KV 头、KV Cache 量化、Prefix Cache 复用公共前缀；
   - PagedAttention 式分页管理，消灭显存碎片，提高 batch 容量；
2. **计算优化**：
   - 量化（INT8/INT4）：减带宽、提速度；
   - 算子与编译优化：FlashAttention 类内核、TensorRT-LLM / vLLM 等推理引擎的融合算子；
3. **解码策略**：
   - 投机解码：小模型草拟 + 大模型并行验证，质量近似下提速；
   - 提前终止/长度控制：合理的 max_tokens 与停止条件；
4. **模型结构**：
   - 更小/蒸馏模型承接合适任务（最根本的优化是「用对的模型」）；
   - 结构化剪枝、MoE（按需激活专家）降低实际计算量；
5. **请求层**：continuous batching、优先级调度、同一会话请求亲和（命中 prefix cache）。

**与系统层的分工**：本题为模型/引擎层；批处理调度、副本扩容、缓存架构见 [系统层吞吐优化](/system-design/inference-throughput)。

**优化闭环**：基线指标（TTFT/TPOT/吞吐）→ 单项优化 → 评估集质量回归 → 上线对比——**每项优化都要同时看「速度收益」和「质量代价」**。

## 深度解析

- Decode 阶段瓶颈是显存带宽：所有「减少每 token 读取量」的手段（量化、GQA、投机解码）都直接命中要害；
- Prefill 阶段瓶颈是算力：长输入场景（RAG 大上下文）优先优化 prefill（prefix 复用、上下文瘦身）；
- 面试建议按「资源瓶颈 → 对应手段」的因果链作答，比堆名词更能体现理解。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [KV Cache](/llm-basics/kv-cache)
- [模型部署策略（量化与边缘部署）](/evaluation-deployment/quantization-edge-deployment)
- [如何优化 LLM 推理吞吐量](/system-design/inference-throughput)
