---
title: Workflow 与 Agent 的边界
category: Agent 架构
tags: [Workflow, Agent, 架构选型, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

Workflow 和 Agent 的边界在哪里？什么时候该用 Workflow，什么时候才用 Agent？

## 核心答案

- **Workflow（工作流）**：控制流由**开发者预先定义**（固定步骤/分支），LLM 只在每个节点内完成任务。路径确定、可测试、便宜。
- **Agent**：控制流由**模型在运行时决定**（自主选择下一步），LLM 是控制器。灵活、能应对未知路径，但贵、慢、不确定。

**判断标准——问三个问题**：

1. 任务的**步骤路径能否提前枚举**？能 → Workflow；
2. 是否真的需要**模型来决定下一步**（而非规则判断）？不需要 → Workflow（连条件分支都是规则）；
3. 失败的容忍度如何？低容忍、强审计场景倾向 Workflow + 人审，Agent 需要额外的护栏。

**经验法则（业界共识）**：**能用 Workflow 就不要用 Agent**。Agent 留给真正开放、路径不可预知的任务（开放调研、多系统联动排障）。

**混合形态（生产主流）**：整体是 Workflow（入口、路由、审批、出口固定），个别节点内部放一个小 Agent（如「研究节点」内部自由检索）。确定性管骨架，自主性填肉。

## 深度解析

- 边界本质是「控制流的归属权」：在谁手里。开发手里是 Workflow，模型手里是 Agent。
- 反模式：为了「上了 Agent」而把固定流程也写成自由 Agent——结果不可测、成本翻倍、回归困难。
- 迁移路径：新任务先手写 Workflow 跑通并收集数据 → 发现路径确实无法枚举的部分 → 把那个子任务升级为 Agent。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Agent 的定义与四组件模型](/agent-architecture/agent-four-components)
- [为什么 Agent 最终会演进为状态机](/frameworks/agent-state-machine-evolution)
- [Agent 工作流引擎设计](/system-design/agent-workflow-engine)
