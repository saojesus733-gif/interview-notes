---
title: ReAct 和状态机怎么区分？不同功能的 agent 模式怎么选取？
category: Agent 架构
tags: [ReAct, 状态机, Workflow, 面试真题]
importance: 2
mastery: 未掌握
source: 牛客网面经
---

## 问题

经纬恒润 AI 应用开发一面（约 30 分钟，已挂），个人项目环节：

- 不同功能之间的 agent 模式是怎么选取的（ReAct 和状态机怎么区分）
- PPT 生成为什么用状态机（**面试官补充说这其实就是工作流**）

## 核心答案

原文未提供答案。原帖唯一给出的信息是面试官的现场反馈：把 PPT 生成用状态机实现的做法，面试官补充说「这其实就是工作流」。

## 深度解析

## 我的理解

（留空，结合智居 Agent 的 LangGraph 工作流填写：路径可枚举、步骤固定的任务用状态机/工作流，把确定性放在代码里；开放探索型任务才用 ReAct 让模型自主决策。）

## 关联题目

- [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
- [Plan-and-Execute 与 ReAct 对比](/agent-architecture/plan-and-execute-vs-react)
- [ReAct 框架核心思想](/agent-architecture/react-framework-core-idea)
- [LangGraph StateGraph](/frameworks/langgraph-stategraph)

## 原始面经

> 节选自《经纬恒润ai应用开发一面面经》三、个人项目：
>
> - 不同功能之间的 agent 模式是怎么选取的（ReAct 和状态机怎么区分）
> - PPT 生成为什么用状态机（面试官补充说这其实就是工作流）
>
> 来源：牛客网面经 https://www.nowcoder.com/feed/main/detail/32d60ac358504e86aab2d634a15b996b
