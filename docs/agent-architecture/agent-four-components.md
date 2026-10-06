---
title: Agent 的定义与四组件模型
category: Agent 架构
tags: [Agent, LLM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

什么是 AI Agent？它和一次普通的 LLM 调用有什么本质区别？

## 核心答案

**Agent = 以 LLM 为决策核心，能自主规划、使用工具、维护记忆，在循环中迭代完成目标的系统。**

与普通 LLM 调用的本质区别：普通调用是「一问一答的映射」，Agent 是「面向目标的循环」——模型自己决定下一步做什么、做多少步，直到达成目标。

**四组件模型**：

1. **LLM（大脑）**：理解任务、推理决策的中央控制器；
2. **规划（Planning）**：任务分解、子目标排序、根据反馈反思与重规划；
3. **工具（Tools）**：突破模型边界的手——检索、API、代码执行、数据库；
4. **记忆（Memory）**：短期记忆（当前上下文）+ 长期记忆（外部存储，跨会话）。

**一个标准 Agent 执行回路**：

```text
接收目标 → LLM 思考 → 选择动作（工具调用/直接回答）
  → 执行动作 → 观察结果 → 写入记忆/上下文
  → LLM 继续思考 → …… → 达成目标，输出结果
```

## 深度解析

- 「自主性」的度：完全自主的循环难控且贵，工业界普遍在「Workflow（流程固定）」与「Agent（模型全权决策）」之间取折中，判断标准见 Workflow 与 Agent 边界一题。
- Agent 的价值前提：任务有**不确定性**（不知道提前要走几步、需要外部信息）。步骤固定的任务用编排脚本更便宜可控。
- 评估一个 Agent 设计好坏的三个问题：决策上下文是否干净（Context Engineering）、工具是否好用、状态是否可恢复。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [ReAct 框架核心思想](/agent-architecture/react-framework-core-idea)
- [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
- [Agent 的记忆机制（自整理版）](/ai/agent-memory)
