---
title: 解码策略（贪婪 / Beam / Top-p / Temperature）
category: LLM 基础
tags: [解码策略, Top-p, Temperature, LLM]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

LLM 生成文本时有哪些解码策略？Temperature 和 Top-p 分别怎么影响输出？

## 核心答案

模型每步输出的是「下一个 token 的概率分布」，解码策略决定从这个分布里怎么选：

- **贪婪解码（Greedy）**：每步选概率最高的 token。确定性强、稳定，但输出单一、可能陷入重复。
- **Beam Search**：维护 k 条最优候选序列一起扩展，最终选整体概率最高的。适合有标准答案的任务（翻译、摘要），生成类对话效果反而呆板，且计算开销大。
- **Temperature**：对 logits 除以 T 再 softmax。T < 1 分布更尖（更确定），T > 1 更平（更多样）。事实问答/工具调用用低温，创意写作用高温。
- **Top-k**：只在概率最高的 k 个 token 里采样，截断长尾。
- **Top-p（nucleus）**：按概率从高到低累加，只从累计概率达到 p 的最小集合里采样。比 Top-k 更自适应：分布尖时候选少，分布平时候选多。
- **常见组合**：生产上通常「Temperature + Top-p（或 Top-k）」搭配使用；API 里 Top-p 与 Temperature 同时调节容易互相干扰，一般调其中一个。

## 深度解析

- Temperature 的数学作用：softmax(z/T)。T→0 趋近贪婪，T→∞ 趋近均匀分布。
- 重复惩罚（repetition penalty / frequency penalty）用于抑制复读，属于采样后的修正手段。
- 工程注意：Function Calling / 结构化输出场景建议低温（甚至 0），减少格式抖动；同一请求想复现结果需 temperature=0 且服务端确定性（并发/批处理可能带来非确定性）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Token 与分词](/llm-basics/tokenization)
- [LLM 幻觉的原理](/llm-basics/hallucination-principle)
