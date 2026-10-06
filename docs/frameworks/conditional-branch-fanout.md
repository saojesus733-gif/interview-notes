---
title: LangGraph 的条件分支与并行 Fan-out / Fan-in
category: 框架
tags: [LangGraph, 并行, 条件分支, Agent]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

LangGraph 里怎么做条件分支和并行执行？并行结果怎么合并？

## 核心答案

**条件分支（Conditional Edges）**：

- 给节点注册条件路由函数：函数**只读当前 State**，返回下一个节点名（或节点列表）；
- 典型用法：agent 节点后挂条件边——State 里有工具调用则去 tools 节点，没有则去 END。

```python
graph.add_conditional_edges("agent", route_fn, {"tools": "tools", "end": END})
```

**并行 Fan-out / Fan-in**：

- **Fan-out**：一条边指向**多个节点**（或条件边返回多个目标），这些节点**并行执行**；
- **Fan-in**：多个并行节点汇合到同一节点，汇合点等待所有上游完成；
- **合并靠 State reducer**：并行节点各自返回对 State 的更新，reducer 定义合并策略——列表字段（如收集结果）用追加，标量字段需自定义归并，否则并发写冲突。

```text
        ┌→ 检索A ┐
query ──┤         ├→ 汇总节点（reducer 合并）
        └→ 检索B ┘
```

**典型场景**：多路检索并行（向量 + 关键词 + Web）、多文档并行摘要、Multi-Agent 并行执行各自子任务。

## 深度解析

- reducer 是并行的安全基石：没有 reducer 的字段被并行节点同时写会互相覆盖（这是新手最常见的 LangGraph bug）；
- fan-in 的等待语义由框架保证——汇聚节点只在所有入边就绪后执行，等价于隐式 barrier；
- 设计并行度时考虑下游模型调用成本：并行 8 路检索 ≈ 8 倍 token，收益要靠评估验证。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 的 StateGraph 三要素](/frameworks/langgraph-stategraph)
- [Multi-Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
