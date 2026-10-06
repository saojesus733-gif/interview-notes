---
title: 位置编码（RoPE / ALiBi）
category: LLM 基础
tags: [位置编码, RoPE, ALiBi, Transformer]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

为什么 Transformer 需要位置编码？RoPE 和 ALiBi 的思路有什么区别？

## 核心答案

- **为什么需要**：自注意力对输入集合是置换不变的，打乱 token 顺序结果不变——必须显式注入位置信息，模型才能理解语序。
- **两大流派**：
  - **绝对位置编码**（原始 Transformer / GPT 早期）：给每个位置一个固定或可学习的向量，加到 token 向量上。缺点：外推到训练未见过的长度表现差。
  - **相对位置编码**：让注意力分数只依赖两个 token 的相对距离。
- **RoPE（旋转位置编码）**：把位置视为旋转角，对 Q/K 向量按位置做复数旋转。两个 token 的注意力得分只取决于它们的**相对**旋转差，天然具备相对位置属性；训练时在短序列上训练，可通过**位置插值 / NTK 缩放**等手段低成本外推到更长上下文，是当前主流（LLaMA、Qwen 等采用）。
- **ALiBi**：不加位置向量，直接在注意力分数上加一个**与相对距离成正比的线性惩罚偏置**——距离越远扣分越多。优点：实现极简、外推性好，无需改 embedding。

## 深度解析

- RoPE 外推的常见做法：位置线性插值（Position Interpolation）把训练外的位置压回训练区间，或 NTK-aware 缩放调整旋转基数；两者都属于「几乎不重训或少量微调即扩窗口」的工程手段。
- ALiBi 的距离惩罚强度由每层一个斜率系数控制（不同层不同头用不同斜率）。
- 面试要点：两者都属「相对位置思想」，都为长上下文外推服务；RoPE 通过旋转 Q/K 实现，ALiBi 通过注意力偏置实现。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Attention 机制](/llm-basics/attention-mechanism)
- [上下文窗口与长上下文](/llm-basics/context-window-long-context)
