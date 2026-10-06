---
title: Few-shot 策略
category: Prompt 工程
tags: [Few-shot, Prompt, ICL]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 Few-shot Prompting？示例怎么选？有什么局限？

## 核心答案

- **定义**：在 Prompt 中放少量「输入→输出」示例，让模型通过上下文学习（In-Context Learning）模仿格式与口径，无需更新任何参数。
- **示例选择原则**：
  1. **相关性**：优先选与当前输入相似的示例（可动态检索最相似样例，即 Dynamic Few-shot）；
  2. **多样性**：覆盖典型场景与边界 case，避免模型只会一种模式；
  3. **正确性**：示例本身必须是标准答案，错误示例会稳定带偏输出；
  4. **格式一致**：示例的格式就是输出契约，必须与要求完全一致；
  5. **数量权衡**：每加一个示例都消耗 Token Budget，一般 3~5 个足够，多了边际收益递减。
- **局限**：
  1. 占用上下文窗口、按 token 计费，每次请求都重复付出成本；
  2. 示例顺序敏感（存在近因效应，后放的示例影响更大）；
  3. 模型可能过度模仿示例的字面模式（如示例里有个错别字）；
  4. 复杂能力（如领域推理）few-shot 教不会，那要靠微调。

## 深度解析

- ICL 并没有改变模型权重，本质是激活了预训练中学到的模式补全能力——这解释了为什么示例格式影响巨大。
- 动态 few-shot：用向量检索从「优质样例库」中挑最相关的 K 条注入，是效果与成本的常用平衡点。
- 对比记忆：Zero-shot（只有指令）→ One-shot（一个示例）→ Few-shot（多个示例）→ 微调（改参数）；成本递增、稳定性递增。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [CoT 与 ReAct 在 Prompt 中的实现](/prompt-engineering/cot-react-prompting)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
- [RAG 与微调的本质区别](/rag/rag-vs-finetune)
