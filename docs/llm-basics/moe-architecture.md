---
title: MoE（混合专家）架构
category: LLM 基础
tags: [MoE, Transformer, 推理优化, LLM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 MoE（Mixture of Experts）架构？它和稠密模型相比有什么优劣？

## 核心答案

- **定义**：MoE 把 Transformer 中的 FFN 层替换为多个"专家"（并行的 FFN）+ 一个**路由器（Router/Gating）**——每个 token 只被路由到少数几个专家（Top-K，通常 1~2 个）处理，其余专家不参与本次计算。
- **核心收益：稀疏激活**。总参数量很大（知识容量大），但每个 token 实际激活的参数量小（计算量小）——"容量与算力解耦"。
- **与稠密模型对比**：

| 维度 | 稠密模型 | MoE |
| --- | --- | --- |
| 参数利用 | 所有参数每 token 全算 | 只激活少量专家 |
| 同等算力下 | 能力上限较低 | 总参数更大，能力上限更高 |
| 显存需求 | 相对低 | 全部专家都要装进显存 |
| 工程复杂度 | 简单 | 路由负载均衡、专家并行、显存压力 |

- **代表模型**：Mixtral、DeepSeek-V3、Qwen 系列 MoE 版本等。

## 深度解析

- **负载均衡**是训练关键难题：路由器倾向把 token 都送给少数"明星专家"，导致其他专家荒废——用负载均衡辅助损失强制均匀；
- **推理显存账**：MoE 的显存占用按"总参数"算，计算量按"激活参数"算——所以 MoE 省算力不省显存，这是它对部署硬件的真实要求；
- **专家并行（Expert Parallelism）**：专家分布到多卡，路由跨卡通信，是 MoE 分布式推理的主要复杂点。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Transformer 架构](/llm-basics/transformer-architecture)
- [LLM 推理性能优化](/evaluation-deployment/inference-optimization)
