---
title: Plan-and-Execute 与 ReAct 的选型对比
category: Agent 架构
tags: [Plan-and-Execute, ReAct, Agent, 规划]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

Plan-and-Execute 和 ReAct 有什么区别？什么样的任务选哪种？

## 核心答案

**ReAct（边想边做）**：每一步临时决定下一个动作，走一步看一步。

**Plan-and-Execute（先规划后执行）**：先把任务拆成显式的步骤列表，再逐步执行，执行中发现偏差可以重规划（Replan）。

```text
Plan-and-Execute:
Planner: 1) 查订单  2) 查库存  3) 比对政策  4) 生成回复
Executor: 逐步执行，每步完成后检查是否符合计划
（偏差大时触发 Replan）
```

**选型对比**：

| 维度 | ReAct | Plan-and-Execute |
| --- | --- | --- |
| 任务长度 | 短任务、步数少 | 长任务、多步骤 |
| 步骤可预估性 | 无法预估 | 可先拆解 |
| 全局性 | 易迷失、路径震荡 | 有全局图，方向稳 |
| 成本 | 每步都全量推理 | 规划贵一次，执行可更聚焦 |
| 灵活性 | 高，随时改道 | 依赖 Replan 机制 |

**经验法则**：简单检索问答用 ReAct；多阶段、跨系统、耗时长（如深度调研、批量处理）用 Plan-and-Execute；两者可以嵌套——整体 Plan-and-Execute，每个子步骤内部是一个 ReAct 循环。

## 深度解析

- Plan-and-Execute 的关键难点在 **Replan 策略**：什么情况重规划（步骤失败/新信息推翻前提）、多久重规划一次（太频繁退化为 ReAct），要设计显式触发条件。
- Plan 的产物建议结构化（步骤、依赖、完成标准），既是执行依据也是进度追踪与恢复的锚点。
- 与人类工作模式类比：ReAct 是「走哪算哪」，Plan-and-Execute 是「列 todo 清单干活」，长项目必然要清单。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [ReAct 框架核心思想](/agent-architecture/react-framework-core-idea)
- [Agent 规划器设计与路径震荡](/agent-architecture/agent-planner-design)
- [Tree of Thoughts 的适用场景](/agent-architecture/tree-of-thoughts-scenarios)
