---
title: 你的 agent 基座在 memory 压缩、同步/异步、session 总结上是怎么做定制的？
category: 记忆与工具
tags: [Agent Runtime, Memory, 上下文管理, 面试真题]
importance: 3
mastery: 未掌握
source: 牛客网面经
---

## 问题

字节 AI 应用工程师一面（飞书多维表格方向，约 70 分钟）项目深挖环节，Agent 相关三连问：

- 为什么项目不用 Claude Code？
- 是否是自己搭建的 Agent runtime？
- 你的 agent 基座在 memory 压缩、同步/异步、session 总结上是怎么做定制的？

（追问背景：面试官先确认你是不是直接套用现成 Agent 框架，再逐层问基座层做了哪些定制。）

## 核心答案

原文未提供答案。

## 深度解析

## 我的理解

（留空，结合智居 Agent / 企业办公 AI 助手项目填写：比如上下文窗口快满时如何做滚动摘要、工具调用与用户交互哪些环节用同步阻塞、哪些用异步任务、多轮 session 结束时如何总结沉淀到长期记忆。）

## 关联题目

- [上下文裁剪与压缩](/agent-memory-tools/context-trimming)
- [Prompt 上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
- [工作记忆与长期记忆的区别](/agent-memory-tools/working-vs-long-term-memory)

## 原始面经

> 节选自《【面经】字节/AI 应用工程师 一面挂经……》（飞书多维表格方向，视频面约 70 分钟），三、项目深挖 → Agent 相关：
>
> - 为什么项目不用 Claude Code？
> - 是否是自己搭建的Agent runtime
> - 你的 agent 基座在 memory 压缩、同步/异步、session 总结上是怎么做定制的？
>
> 作者总结：项目 + 场景设计题占大头，几乎全程围绕 memory、context、多 agent 编排、自迭代、评测体系。
>
> 来源：牛客网面经 https://www.nowcoder.com/discuss/933023499399024640
