---
title: LangGraph 的 StateGraph 三要素（Node / Edge / State）
category: 框架
tags: [LangGraph, StateGraph, Agent, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

LangGraph 的 StateGraph 有哪三要素？各自的职责边界是什么？

## 核心答案

**三要素**：

1. **State（状态）**：整张图的**共享数据通道**——一个（通常带类型定义的）结构化对象，所有节点读写它；通过 **reducer** 声明每个字段的合并策略（如消息列表是追加而不是覆盖）。
2. **Node（节点）**：**执行单元**——一个函数：读入当前 State，做一件事（调 LLM、执行工具、业务逻辑），**返回对 State 的增量更新**。节点不决定流程去向。
3. **Edge（边）**：**控制流转**——定义「从节点 A 到节点 B」。普通边固定跳转；**条件边（conditional edge）**根据当前 State 计算出下一个节点（如「有工具调用 → 工具节点；否则 → END」）。

**职责边界（一面试官最想听的总结）**：

- 节点管「**做事**」：加工数据，不决定去哪；
- 边管「**去哪**」：只读 State 做路由决策，不加工数据；
- State 管「**数据怎么流动与合并**」：是节点间唯一的通信介质，没有隐藏的全局变量。

```text
START → agent 节点 →（条件边：有 tool_call?）→ tools 节点 → 回 agent → …… → END
```

## 深度解析

- State + reducer 是并行 Fan-out 能合流的关键：多个并行节点各自返回更新，reducer 定义如何合并（追加、覆盖、自定义归并）；
- 图编译后自带 checkpoint 机制（持久化 State 快照），断点恢复、时间旅行调试、HITL 挂起/恢复都建立在此之上；
- 判断职责是否写反：节点里写 if 跳转逻辑 = 该抽成条件边；边里做数据处理 = 该挪进节点。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 与 LangChain 的关系与差异](/frameworks/langgraph-vs-langchain)
- [LangGraph 的条件分支与并行 Fan-out/Fan-in](/frameworks/conditional-branch-fanout)
- [控制流与数据流的解耦](/agent-architecture/control-flow-data-flow-decoupling)
