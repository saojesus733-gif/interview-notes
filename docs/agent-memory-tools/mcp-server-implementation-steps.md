---
title: 要让你写一个 MCP 的话，应该怎么做？接入方式有哪些？
category: 记忆与工具
tags: [MCP, 工具开发, 面试真题]
importance: 2
mastery: 未掌握
source: 牛客网面经
---

## 问题

迅雷 Agent 一面：

- 要让你写一个 MCP 的话，应该怎么做？（作者回忆提到：@Tools @Param，将你的工具注册后对外暴露，在你要用的服务引入）
- 接入方式有哪些？（作者回忆提到：stdio 等）

## 核心答案

原文未提供答案。（作者现场回忆要点：用注解如 @Tools、@Param 声明工具与参数，注册后对外暴露，在使用方服务里引入；接入方式如 stdio。）

## 深度解析

## 我的理解

（留空，结合 Python 栈填写：用 `mcp` Python SDK / FastMCP 定义 tool 函数与参数 schema、注册到 server、选择 stdio 或 Streamable HTTP 传输、在客户端配置接入并列举工具。）

## 关联题目

- [工具设计原则与 MCP 协议](/agent-memory-tools/tool-design-principles-mcp)
- [Skill / MCP / Rule 的区别](/agent-memory-tools/skill-mcp-rule)
- [A2A 与 MCP 的区别](/agent-memory-tools/a2a-vs-mcp)
- [工具调用机制](/agent-memory-tools/tool-calling-mechanism)

## 原始面经

> 节选自《迅雷 Agent一面》第 5 题：
>
> 要让你写一个MCP的话，应该怎么做（@Tools @Param，将你的工具注册后对外暴露，在你要用的服务引入），接入方式有哪些stdio等
>
> 来源：牛客网面经 https://www.nowcoder.com/discuss/932392798559432704
