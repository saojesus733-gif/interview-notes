---
title: ReAct 框架核心思想与 TAO 循环
category: Agent 架构
tags: [ReAct, Agent, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

讲一下 ReAct 框架的核心思想，Thought-Action-Observation 循环是怎么运转的？

## 核心答案

**ReAct = Reasoning + Acting**：让模型交替进行「推理」和「行动」，行动结果再反哺推理。

**TAO 循环**：

```text
Thought（思考）：分析当前状态，决定下一步
  ↓
Action（行动）：选择工具并给出参数（如 search("X")）
  ↓
Observation（观察）：系统执行工具，结果回填到上下文
  ↓
Thought：基于观察继续推理 ……（循环）
  ↓
Final Answer（终止）：认为信息足够，给出最终答案
```

**核心思想**：

1. 推理不再凭空进行，每步推理都能基于**真实环境反馈**（Observation）；
2. 行动不再盲目，每次行动都有**显式的思考**作为依据；
3. 整个链路可观察、可解释——每一步为什么调工具都写在 Thought 里，便于调试。

**优点**：实现简单、灵活、通用性强；**缺点**：没有全局计划，长任务容易迷失或震荡，多轮循环 token 成本高。

## 深度解析

- 现代实现通常不再靠文本解析 Thought/Action，而是用原生 Function Calling：模型输出结构化工具调用，Observation 即工具结果消息。ReAct 从「Prompt 模式」沉淀为「协议级循环」。
- 终止控制是工程要点：最大迭代轮数、预算上限、重复检测（连续相同 Action 判定震荡）。
- ReAct 循环是几乎所有 Agent 框架的内核，LangGraph 的 agent 节点、OpenAI 的 tool loop 本质都是 TAO 循环的工程化封装。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Plan-and-Execute 与 ReAct 的选型对比](/agent-architecture/plan-and-execute-vs-react)
- [CoT 与 ReAct 在 Prompt 中的实现](/prompt-engineering/cot-react-prompting)
- [Agent 执行循环与状态化设计](/agent-architecture/agent-execution-loop-state)
