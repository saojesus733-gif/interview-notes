---
title: Orchestrator-Workers 模式怎么落地？
category: Agent 架构
tags: [Multi-Agent, Orchestrator, 架构设计, LangGraph]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Orchestrator-Workers（主控-执行者）模式是什么？主 Agent 怎么规划和分配任务，子 Agent 怎么执行？和 Supervisor 模式是一回事吗？

## 核心答案

**结构**：

1. **Orchestrator（主控）**：理解总体任务 → 拆解为结构化子任务（目标/输入/完成标准）→ 分派给专职 Workers → 收集结果 → 校验汇总，必要时迭代分派；
2. **Workers（执行者）**：各自只见**自己的子任务上下文**（隔离），调用自己领域的工具，产出**结构化结论**返回；
3. **关键约定**：任务单结构化、结果结构化、一切通信经 Orchestrator 汇聚——Workers 之间不直接对话。

**与 Supervisor 模式的关系**：同构。Supervisor 更偏"对话分派"语义（客服场景把用户请求转给对应专员），Orchestrator 更偏"任务分解"语义（复杂任务拆多个子任务并行执行）；实践中常混用同一套骨架。

**落地形态**：LangGraph 的 fan-out（并行节点）+ reducer 汇聚天然适配；Workers 可以是同一图里的并行节点，也可以是独立的子图/服务。

## 深度解析

- 加分点：并行执行的收益与代价——Workers 并行降低延迟，但 token 成本线性增长，要用评估验证拆分值得（呼应 Multi-Agent 协作模式）；
- 错误传播防线：Orchestrator 必须校验 Worker 结果（格式 + 完成标准），不合格的重派或降级；
- 雷区：把完整对话历史塞给每个 Worker——上下文爆炸；Worker 之间点对点通信——拓扑失控。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Multi-Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
- [LangGraph 的条件分支与并行 Fan-out / Fan-in](/frameworks/conditional-branch-fanout)
- [场景：Multi-Agent 智能客服](/system-design/multi-agent-support-system)
