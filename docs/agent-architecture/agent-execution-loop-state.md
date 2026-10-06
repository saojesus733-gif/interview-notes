---
title: Agent 执行循环与状态化设计
category: Agent 架构
tags: [Agent, 状态机, 架构设计, Agent]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

如何设计 Agent 的执行循环？为什么要做「状态化」而不是把一切放在对话上下文里？

## 核心答案

**执行循环的标准骨架**：

```text
state = 初始化(任务输入)
while not state.终止:
    state = llm_step(state)        # 模型决策：完成 / 调工具 / 重规划
    if state.动作 == 工具调用:
        result = 执行(state.工具, state.参数)   # 带超时/重试
        state = 合并观察(state, result)
    state = 护栏检查(state)         # 预算、震荡检测、异常处理
输出 state.结论
```

**状态化设计**：把运行状态显式建模为结构化数据并持久化——

- 当前步骤 / 剩余计划、各步结果与结论；
- 重试计数、消耗预算（token / 步数 / 费用）；
- 中间产物（检索结果、工具输出摘要）。

**为什么必须状态化**：

1. **可恢复**：进程崩溃、限流中断后从检查点续跑，而不是从头再来；
2. **可审计**：每步决策依据与工具结果可回溯，出问题能复盘；
3. **可控**：预算、护栏、人审（HITL）都挂在状态上，而不是埋在对话文本里；
4. **可测试**：给定状态可以重放决策逻辑做回归。

## 深度解析

- 「上下文里的对话」与「状态存储」要分职责：对话是给模型看的视图（可裁剪、可摘要），状态是系统的事实源（结构化、全量、持久化）。两者靠「上下文构建器」同步。
- 工具调用要**幂等**设计（带 idempotency key），因为循环重试/恢复后可能重复执行写操作。
- 长任务的状态布局建议：进度表 + 关键结论 + 未决问题三块，恰好对应重规划与恢复所需的全部信息。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [为什么 Agent 最终会演进为状态机](/frameworks/agent-state-machine-evolution)
- [Agent 规划器设计与路径震荡](/agent-architecture/agent-planner-design)
- [对话记忆持久化](/agent-memory-tools/memory-persistence)
