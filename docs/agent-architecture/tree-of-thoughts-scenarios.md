---
title: Tree of Thoughts 的适用场景
category: Agent 架构
tags: [Tree of Thoughts, CoT, 推理, Agent]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Tree of Thoughts（ToT）是什么？相比 CoT 它适合什么场景？代价是什么？

## 核心答案

- **定义**：Tree of Thoughts 把推理组织成**树状搜索**：从问题出发分叉出多个中间思路（Thought），每条思路可以继续展开、被评估打分，差的方向剪枝，好方向深挖，必要时回溯换路。
- **与 CoT 的区别**：
  - CoT 是**单链**：一条推理路径走到底，中途错了就一路错下去；
  - ToT 是**多路**：并行探索多条路径 + 评估回溯，本质是把「搜索」引入 LLM 推理。
- **适用场景**：
  1. 需要探索、试错的推理任务（数学证明、谜题、规划类问题）；
  2. 单链推理容易早期锁死错误方向的场景；
  3. 有明确中间状态评估标准的问题（能判断某个思路「有没有希望」）。
- **代价**：每层分叉都要多次 LLM 调用，成本是 CoT 的数倍到数十倍，延迟显著增加——**高价值、低频、难推理**的任务才值得用。

## 深度解析

- ToT 三要素：**思维分解**（一次「想法」的粒度）、**评估函数**（打分：模型自评/启发式/规则）、**搜索算法**（BFS/DFS，决定展开与剪枝策略）。
- 与 ReAct 的关系：ToT 解决「推理空间大、要试错」的问题，ReAct 解决「要外部信息」的问题；部分实现把 ToT 的评估回溯思想用在 Agent 的分支决策上（多方案并行试、择优续走）。
- 面试表达建议：先说清「搜索空间 + 评估 + 回溯」三个词，再给适用与代价，体现的是对成本的清醒。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [CoT 与 ReAct 在 Prompt 中的实现](/prompt-engineering/cot-react-prompting)
- [Plan-and-Execute 与 ReAct 的选型对比](/agent-architecture/plan-and-execute-vs-react)
- [成本控制](/evaluation-deployment/cost-optimization)
