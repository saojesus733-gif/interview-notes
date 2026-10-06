---
title: Reflexion：Agent 执行失败后怎么自我纠错？
category: Agent 架构
tags: [Reflexion, 反思, Agent, 自我纠错]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Agent 执行一个任务失败了，直接重试大概率还是失败。听说过 Reflexion 这类自我纠错机制吗？它是怎么让 Agent"越挫越明"的？

## 核心答案

**Reflexion 的核心思想：失败后不急着重试，先生成"语言化的自我反思"，把教训带进下一次尝试**。

1. **循环结构**：行动（Act）→ 评估（Evaluate：环境反馈/自评判定失败）→ 反思（Reflect：生成"哪里错了、为什么、下次怎么办"的结构化文本）→ 把反思写入记忆 → 带着教训重试；
2. **与朴素重试的区别**：朴素重试上下文不变，模型大概率重复同样的错误；Reflexion 把失败经验**显式化**为上下文的一部分，改变下一次决策依据；
3. **评估信号的来源**：环境真实反馈（测试不过/工具报错）、外部校验器、或模型自评。

## 深度解析

- 工程要点：**限制反思轮数**（1~2 轮），每轮反思都要引用具体失败证据，防止"空反思"越想越偏；
- 反思结果建议结构化存储（问题/原因/对策三段），并可沉淀为长期经验（跨任务复用的教训库）；
- 雷区：把"失败重试"就叫 Reflexion——核心是**反思产出的教训文本参与下次决策**，不是单纯多试几次；
- 与规划器震荡的关系：反思是对抗震荡的有效手段之一（呼应规划器设计与死循环题）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Agent 规划器设计与路径震荡](/agent-architecture/agent-planner-design)
- [场景：Agent 死循环与预算失控治理](/scenarios/agent-infinite-loop)
- [Tree of Thoughts 的适用场景](/agent-architecture/tree-of-thoughts-scenarios)
