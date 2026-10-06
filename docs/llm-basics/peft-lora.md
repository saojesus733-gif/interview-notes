---
title: LoRA / PEFT 参数高效微调
category: LLM 基础
tags: [LoRA, 微调, PEFT, LLM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 LoRA？为什么它能用极少的训练资源完成微调？

## 核心答案

- **背景**：全量微调大模型要更新全部权重，训练显存与算力成本极高，且每个下游任务都要存一份完整模型副本。
- **LoRA（Low-Rank Adaptation）思路**：冻结原模型权重 W，在旁路学习一个**低秩增量** ΔW = A×B（A、B 是两个小矩阵，秩 r 很小，如 8~64）。推理时输出 = Wx + BAx，等价于带增量的原模型。
- **为什么省资源**：
  1. 可训练参数量骤降（通常不到原模型的 1%）——优化器状态与梯度显存随之骤降；
  2. 原权重冻结，训练稳定性好；
  3. 增量矩阵很小，**一个任务只存几十 MB 的 LoRA 权重**，一个底座可挂多个任务适配器，按需切换/合并。
- **PEFT**：参数高效微调方法的统称（Parameter-Efficient Fine-Tuning），LoRA 是其中最主流的代表，同类还有 Prefix/Prompt Tuning、Adapter 等。

## 深度解析

- 为什么"低秩"可行：主流观点认为微调带来的权重变化本就近似低秩，任务信息不需要动全部参数就能装下；
- 常挂载位置：注意力的 Q/K/V/O 投影最常用，FFN 也可加；秩 r 与作用层越多，容量越大、成本越高——用任务评估调；
- 与量化结合：QLoRA = 4bit 量化底座 + LoRA 微调，单卡即可微调较大模型，极大降低门槛；
- 面试边界感：LoRA 改变的是行为与风格（适配任务），不用于"灌知识"——知识问题仍归 RAG（呼应 RAG vs 微调选型）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [RAG 与微调的本质区别](/rag/rag-vs-finetune)
- [开源模型 vs 闭源模型选型](/llm-basics/open-vs-closed-source-models)
- [模型部署策略（量化与边缘部署）](/evaluation-deployment/quantization-edge-deployment)
