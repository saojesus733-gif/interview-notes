---
title: Skill / MCP / Rule 的区别
category: 记忆与工具
tags: [Skill, MCP, Agent, 架构设计]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

在 Agent 系统中，Skill、MCP、Rule 分别指什么？如何配合使用？

## 核心答案

三者回答的是三个不同的问题：

- **Skill（技能）**：「Agent 会做什么」——**能力的封装**。一个 Skill = 完成某类任务所需的结构化包：操作指引（提示词/流程）、可用的工具组合、示例与约束。例如「生成周报技能」内部约定了先查数据源、再套模板、再润色的完整流程。
- **MCP（Model Context Protocol）**：「外部能力怎么接进来」——**接入协议**。标准化工具与资源的发现、调用、鉴权，解决 M×N 集成问题。它是管道，不关心业务流程。
- **Rule（规则）**：「Agent 必须遵守什么」——**行为约束**。安全红线、输出规范、审批要求、边界条件。通常落在 System Prompt、护栏代码与权限配置中。

**配合关系**：

```text
Rule 划定边界（能做什么、什么必须人审）
  ↓
Skill 组织流程（这类任务按什么步骤做）
  ↓
工具/MCP 提供执行手段（具体怎么查、怎么写）
```

- 举例：转账场景中，Rule = 「单笔超 5000 必须人工审批」；Skill = 「账单缴纳技能」定义查账单→确认→支付的流程；MCP/工具 = 银行查询与支付 API 的标准化接入。

## 深度解析

- 概念边界随生态演进而变（不同框架对 Skill 的定义不完全相同），面试时建议先给「能力封装 / 接入协议 / 行为约束」的功能性区分，再举业务例子，比背名词稳。
- 判断某个东西放哪：改它的频率与归属——流程变了动 Skill，红线变了动 Rule，工具对接变了动 MCP 配置。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [工具设计原则与 MCP](/agent-memory-tools/tool-design-principles-mcp)
- [System Prompt 设计](/prompt-engineering/system-prompt-design)
- [Agent 安全与权限控制](/evaluation-deployment/agent-security)
