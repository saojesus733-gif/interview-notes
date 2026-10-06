---
title: LangGraph 的 Interrupt 中断恢复怎么实现？
category: 框架
tags: [LangGraph, Interrupt, HITL, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

LangGraph 里怎么实现"执行到某一步暂停，等人工审批后继续跑"？讲一下 Interrupt 机制的完整链路。（简历项目：智居 Agent 的 Interrupt 中断恢复）

## 核心答案

**核心三件套：interrupt() + checkpointer + Command 恢复**。

1. **声明中断**：在需要人工介入的节点里调用 `interrupt(payload)`——图执行**立即暂停**，payload（如待审批的工具调用参数）抛给调用方；
2. **状态持久化**：暂停时刻的完整 State 由 **checkpointer**（Postgres/Redis/内存 saver）写入存储，进程可以安全退出——这是"断点"的物理载体；
3. **恢复执行**：审批结果通过 `Command(resume=...)` **以同一 thread_id** 重新 invoke 图——从断点处继续跑，而不是重头执行；
4. **完整链路**：执行 → interrupt 抛出 → 后端收到中断事件 → 状态已落库 → 通知审批人 → 前端收集决定 → Command(resume) 恢复 → 图继续到下一中断或结束。

**典型场景**：高危工具执行前审批（转账/删除/外发）、信息不足时向用户澄清提问、长任务的阶段性确认。

## 深度解析

- **没有 checkpointer 就没有中断恢复**：interrupt 依赖状态持久化，生产环境用 Postgres/Redis saver 而不是内存 saver；
- 恢复时 `interrupt()` 会**返回 resume 的值**（同一节点代码位置续跑）——所以节点里 interrupt 之后的逻辑要写成"用 interrupt 的返回值继续"，而不是假设从头执行；
- 版本提示：`interrupt()` 是 LangGraph 0.2+ 的标准写法，更早版本用 NodeInterrupt / 中断节点等不同姿势，面试注明版本；
- 雷区：中断后服务重启必须能从 checkpoint 恢复——测试要覆盖"中断 → 杀进程 → 恢复"路径（简历项目正是这个点，务必能讲出验证过程）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)
- [LangGraph 的 StateGraph 三要素](/frameworks/langgraph-stategraph)
- [Agent 工作流引擎设计](/system-design/agent-workflow-engine)
