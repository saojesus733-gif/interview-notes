---
title: Agent 工作流引擎设计
category: 系统设计
tags: [工作流引擎, Agent, 系统设计, 架构设计]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

如果要自研一个 Agent 工作流引擎（类似 LangGraph），核心模块怎么设计？

## 核心答案

**核心抽象（StateGraph 同构）**：

1. **状态模型（State）**：用户自定义的结构化状态 + 字段级 reducer（合并策略）；
2. **节点执行器（Node Runtime）**：节点 = 注册的函数（LLM 调用/工具/纯逻辑），读状态、返回增量更新；统一超时、重试、埋点；
3. **流转定义（Edge/条件边）**：静态边 + 条件路由函数（只读状态决定去向）；
4. **调度循环（Executor）**：从当前节点取边 → 执行节点 → 应用状态更新（经 reducer）→ 判断终止/挂起 → 循环；
5. **持久化（Checkpointer）**：每步转移后保存状态快照（版本号 + 状态 + 待执行节点），支持恢复与回放。

**关键机制**：

- **断点恢复**：崩溃后加载最近快照，从待执行节点继续；
- **挂起/恢复（HITL）**：节点可声明中断，状态落库、等待外部输入（人工审批）后唤醒续跑；
- **并行执行**：fan-out 节点并发跑，fan-in 等待合并（reducer 保证一致性）；
- **护栏**：最大步数、预算、超时、死循环检测（状态指纹去重）；
- **可观测**：每次转移记录 trace（节点、耗时、token、状态 diff）。

**接口设计**：声明式 API（代码或 DSL 定义图）+ 运行时 API（启动、恢复、取消、查询状态、订阅事件）。

## 深度解析

- 与通用工作流引擎（Temporal/Argo）的差异：Agent 引擎的核心是「LLM 决策的不确定性」——节点输出影响下一步走向，所以条件边、预算护栏、状态回放是第一公民；通用引擎的确定性 DAG 调度反而是子集；
- 状态序列化兼容性：状态 Schema 会演进，快照要带版本、支持向后兼容加载，否则升级即报废所有进行中的会话；
- 自研 vs 用 LangGraph 的判断：编排复杂度是否值得引擎级投入；多数团队「借鉴其抽象、复用其实现」更经济。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [为什么 Agent 最终会演进为状态机](/frameworks/agent-state-machine-evolution)
- [Agent 执行循环与状态化设计](/agent-architecture/agent-execution-loop-state)
- [分布式 Agent 调度系统](/system-design/distributed-agent-scheduling)
