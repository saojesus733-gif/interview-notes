---
title: 选开源框架构建 Agent Runtime 看哪些维度？迁到云端架构怎么分层、模型接入放哪层？
category: 框架
tags: [Agent Runtime, 框架选型, 云端架构, 面试真题]
importance: 2
mastery: 未掌握
source: 牛客网面经
---

## 问题

字节剪映 AI 应用开发一面，结尾的架构题（保留原始问法与顺序）：

- 如果选择一个开源框架构建 Agent Runtime，会从哪些维度选型？
- 当前 Agent 在本地运行，如果迁移到云端或服务器，整体架构应该如何设计？可以分成哪些层？还需要补充什么？
- 模型如何接入系统？模型接入应该放在哪一层？
- 系统搭建完成后，如何向用户提供服务，让用户实际使用？

## 核心答案

原文未提供答案。

## 深度解析

## 我的理解

（留空，结合 Python 栈填写：选型维度——状态管理/中断恢复（LangGraph Interrupt）、流式、可观测性、社区生态、 License；云端分层——接入层（会话/鉴权）→ 编排层（Agent Runtime）→ 模型网关层 → 工具/数据层，补充队列、持久化会话存储与水平扩展；模型接入收口在模型网关层而非散落在业务里。）

## 关联题目

- [框架选型](/frameworks/framework-selection)
- [Agent 框架对比](/frameworks/agent-framework-comparison)
- [LLM Gateway](/system-design/llm-gateway)
- [LangGraph Interrupt](/frameworks/langgraph-interrupt)

## 原始面经

> 节选自《字节剪映AI应用开发一面》第 42–45 题（全帖结尾）：
>
> 42. 如果选择一个开源框架构建 Agent Runtime，会从哪些维度选型？
> 43. 当前 Agent 在本地运行，如果迁移到云端或服务器，整体架构应该如何设计？可以分成哪些层？还需要补充什么？
> 44. 模型如何接入系统？模型接入应该放在哪一层？
> 45. 系统搭建完成后，如何向用户提供服务，让用户实际使用？
>
> 来源：牛客网面经 https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d
