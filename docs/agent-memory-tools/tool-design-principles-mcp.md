---
title: 工具设计原则与 MCP 协议
category: 记忆与工具
tags: [工具调用, MCP, Agent, 架构设计]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给 Agent 设计工具时有哪些原则？MCP 协议解决了什么问题？

## 核心答案

**工具设计原则**：

1. **职责单一**：一个工具做一件事，复合操作拆开，让模型可组合调用；
2. **描述写给人也写给模型**：name 语义化，description 说清「做什么 + 什么时候用 + 什么时候不该用」；
3. **参数少而精**：能从上下文推断的不要设参数；必填项最小化；枚举值写进 Schema；
4. **返回信息密度高**：返回模型需要的结论与关键字段，别把 10 万行原始数据丢进上下文；
5. **工程完备**：幂等（重试安全）、超时、明确错误语义（错误消息要「可被模型读懂」）、权限校验；
6. **可观测**：每次调用记录入参出参与耗时，追踪到 trace。

**MCP（Model Context Protocol）**：

- **解决的问题**：M×N 集成问题——M 个应用 × N 个工具，每个应用都要为每个工具写一遍对接。MCP 把「应用 ↔ 工具」的对接标准化为协议：工具方实现一次 MCP Server，所有支持 MCP 的应用（Client）都能用。
- **核心抽象**：Server 对外暴露三类能力——Tools（可执行操作）、Resources（可读数据）、Prompts（预置提示模板）；Host 应用统一发现与调用。
- **价值**：工具生态可复用、供应商解耦、权限与审计有统一位置。

## 深度解析

- 工具粒度权衡：太细（模型要连调多步，出错率高）vs 太粗（参数复杂、复用性差），常用标准是「一次调用对应一个业务动作」。
- MCP 与 Function Calling 的关系：FC 是「模型如何表达调用意图」的模型侧协议，MCP 是「工具如何被应用发现与调用」的生态侧协议，两者互补而非竞争。
- 工具版本管理：改参数结构 = 破坏性变更，要版本化并灰度，因为「学会用旧版工具」的 Prompt 与示例会失效。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Tool Calling 机制](/agent-memory-tools/tool-calling-mechanism)
- [Skill / MCP / Rule 的区别](/agent-memory-tools/skill-mcp-rule)
- [Agent 与外部 API 的集成](/agent-memory-tools/agent-api-integration)
