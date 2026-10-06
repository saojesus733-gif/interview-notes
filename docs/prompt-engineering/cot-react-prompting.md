---
title: CoT 与 ReAct 在 Prompt 中的实现
category: Prompt 工程
tags: [CoT, ReAct, Prompt, Agent]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

CoT 和 ReAct 分别怎么用 Prompt 实现？各自适用什么场景？

## 核心答案

**CoT（Chain-of-Thought，思维链）**：让模型在给答案前先输出推理过程。

- Zero-shot CoT：一句指令触发，如「请一步一步思考再作答」；
- Few-shot CoT：在示例中示范「问题 → 推理步骤 → 答案」的格式，模型模仿该格式推理；
- 适用：数学、逻辑、多条件判断等需要多步推理的任务；简单任务用 CoT 反而增加成本与出错面。

**ReAct**：在 CoT 基础上引入「行动」，推理与外部交互交替：

```text
可用工具：[search, calculator]
格式约定：
Thought: 我需要先查 X
Action: search
Action Input: "X"
（系统执行后回填）
Observation: ...
Thought: ...（循环，直到）
Final Answer: ...
```

- 关键 Prompt 要素：工具清单及说明、Thought/Action/Observation 格式约定、终止条件（何时输出 Final Answer）；
- 适用：需要外部信息或真实操作的任务（检索、查库、调用 API）。

**一句话区分**：CoT 只在参数化知识内推理；ReAct 能突破模型边界，边推理边拿真实数据。

## 深度解析

- 常见实现差异：ReAct 既可以用纯 Prompt + 文本解析实现（早期 LangChain Agent），也可以走 Function Calling 协议（模型原生输出结构化调用）。后者解析更稳，是现代主流。
- CoT 的坑：模型可能「推理正确、答案抄错」或反之，评估时要看整条链；推理步骤过长的任务适合配合 Plan-and-Execute 拆分。
- 多任务串联时把「链式 Prompt」（前一问的结论作为后一问输入）与 CoT 结合，可以控制单步复杂度。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [ReAct 框架核心思想](/agent-architecture/react-framework-core-idea)
- [Few-shot 策略](/prompt-engineering/few-shot-strategies)
- [System Prompt 设计](/prompt-engineering/system-prompt-design)
