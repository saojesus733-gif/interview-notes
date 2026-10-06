---
title: Multi-Agent 协作模式（Planner / Worker / Reviewer）
category: Agent 架构
tags: [Multi-Agent, Agent, 架构设计, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

Multi-Agent 系统有哪些常见协作模式？什么时候需要多个 Agent，而不是一个？

## 核心答案

**先想清楚要不要 Multi-Agent**：单 Agent 能解决的不拆——多 Agent 引入通信成本、状态同步与错误放大。需要拆的信号：上下文互相冲突、工具集过大互相干扰、任务天然需要并行或独立视角。

**常见协作模式**：

1. **Supervisor / Worker（主管-执行者）**：主管 Agent 理解任务、分派给专职 Worker（检索员、分析员、写手），汇总结果。**最常用**，结构清晰、权限可分层；
2. **流水线（Pipeline）**：Agent 按处理链顺序接力，上游输出是下游输入（提取 → 清洗 → 生成 → 审核）；
3. **评审模式（Generator–Critic）**：生成者产出，评审者挑错打回，循环到达标——用第二双眼睛压幻觉与质量问题；
4. **辩论/投票（Debate / Voting）**：多个 Agent 独立作答后辩论或投票，用冗余换可靠性；
5. **黑板模式（Blackboard）**：所有 Agent 读写共享状态板，各自认领擅长的部分，松耦合但同步复杂。

**Planner / Worker / Reviewer 组合**：规划者拆任务并分派，多个 Worker 并行执行，评审者质量把关——覆盖「计划-执行-质检」闭环，是复杂系统的经典骨架。

## 深度解析

- 通信设计是核心难题：Agent 之间传「结构化任务单 + 结论」而不是整个对话历史，否则上下文爆炸；
- 错误传播：上游错，下游全错——关键节点要有独立校验（Reviewer 的价值就在这）；
- 成本核算：N 个 Agent 不是 N 倍能力，往往是 N 倍成本换一段质量增益，必须用评估数据验证拆分值得。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Multi-Agent 协作系统设计（智能客服）](/system-design/multi-agent-support-system)
- [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
- [分布式 Agent 调度系统](/system-design/distributed-agent-scheduling)
