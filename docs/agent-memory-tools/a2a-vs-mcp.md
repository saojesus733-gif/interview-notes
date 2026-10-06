---
title: A2A 与 MCP 的区别是什么？
category: 记忆与工具
tags: [A2A, MCP, Agent, 面试高频]
importance: 2
mastery: 未掌握
source: 字节 Agent 岗面经题（经搜索验证）
---

## 问题

A2A 和 MCP 分别是什么？它们是竞争关系吗？什么时候用哪个？（2025-2026 年 Agent 岗新热点，字节等厂已在面试中考察）

## 核心答案

**一句话区分：MCP 是"垂直"协议——连接 Agent 与它的工具/数据；A2A 是"水平"协议——连接 Agent 与 Agent。**

- **MCP（Model Context Protocol，Anthropic 2024 年发布）**：标准化 Agent 与外部能力（Tools / Resources / Prompts）的对接——解决"M 个应用 × N 个工具"的 M×N 集成问题，工具方实现一次 MCP Server，所有支持 MCP 的 Client 都能用；
- **A2A（Agent2Agent，Google 2025 年发布，后捐赠给 Linux Foundation）**：标准化**不同 Agent 之间的互操作**——跨厂商/跨框架的 Agent 互相发现、协商能力、委派任务、交换产物；
- **关系：互补而非竞争**。一个典型分层：我的 Agent 通过 MCP 连接自己的工具集，通过 A2A 与外部伙伴 Agent 协作。

**A2A 的三个核心概念**：

1. **Agent Card**：Agent 的"能力名片"（JSON 文档），用于能力发现——别人怎么知道你能干什么；
2. **Task**：有状态的任务生命周期（提交/执行/完成/失败），支持长时间运行的任务与状态轮询/推送；
3. **Artifact**：任务产物的标准化交换格式。

## 深度解析

- 面试答法框架：先给"垂直 vs 水平"的一句话定位，再各举一个使用场景（MCP：给我的客服 Agent 接工单系统；A2A：让我的 Agent 委派订票 Agent 完成子任务），体现概念清晰；
- 时效声明：两个协议都在快速演进（A2A 已进入 Linux Foundation 基金会治理，生态尚早期），面试讲"定位与思想"为主，具体 API 细节以官方文档为准；
- 与 Function Calling 的层次关系：FC 是"模型表达调用意图"的模型侧机制，MCP 是工具接入的应用侧协议，A2A 是 Agent 间协作的生态侧协议——三层各管一段（呼应 MCP 题）；
- 雷区：把 A2A 说成"MCP 的替代品"或"多 Agent 必须用 A2A"——单系统内的多 Agent 编排（LangGraph）用不着 A2A，跨组织互操作才是它的场景。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [工具设计原则与 MCP 协议](/agent-memory-tools/tool-design-principles-mcp)
- [Skill / MCP / Rule 的区别](/agent-memory-tools/skill-mcp-rule)
- [Multi-Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
