---
title: 场景设计：数据分析 Agent——老板总问「为什么今天这个数据异常」怎么设计？
category: 系统设计
tags: [场景设计题, 数据分析 Agent, Memory, 架构设计]
importance: 3
mastery: 未掌握
source: 牛客网面经
---

## 问题

字节 AI 应用工程师一面（飞书多维表格方向）四、场景设计题，七连问（保留原始问法与顺序）：

- 假设让你做一个数据分析的 agent，老板经常问「为什么今天这个数据异常 / 标高了」，你会怎么设计？
- Memory 你会怎么设计？
- 上下文怎么管理？
- 需要几个 agent？架构怎么设计？
- 如果业务表结构变了、加了新表，怎么处理？
- 具体怎么落地实现？
- 你觉得难点是什么？

## 核心答案

原文未提供答案。

## 深度解析

## 我的理解

（留空，后续自行填写。可思考的作答框架：先把「为什么异常」拆成归因链（指标下钻→维度拆解→事件对齐），再谈 memory（会话内指标口径记忆 + 跨会话业务知识沉淀）、上下文（schema 摘要常驻、查询结果分页）、单/多 Agent 取舍、schema 变更的元数据驱动方案，最后主动讲难点（口径一致性、归因的正确性评估）。）

## 关联题目

- [Agent 基座定制：memory 压缩、同步/异步、session 总结](/agent-memory-tools/agent-runtime-customization)
- [多 Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
- [记忆系统设计](/system-design/memory-system-design)
- [多 Agent 智能客服系统](/system-design/multi-agent-support-system)

## 原始面经

> 节选自《【面经】字节/AI 应用工程师 一面挂经……》四、场景设计题：数据分析 Agent：
>
> 假设让你做一个数据分析的 agent，老板经常问「为什么今天这个数据异常 / 标高了」，你会怎么设计？／Memory 你会怎么设计？／上下文怎么管理？／需要几个 agent？架构怎么设计？／如果业务表结构变了、加了新表，怎么处理？／具体怎么落地实现？／你觉得难点是什么？
>
> 作者总结：项目 + 场景设计题占了大头，几乎全程围绕「AI 应用工程」的方法论在问。
>
> 来源：牛客网面经 https://www.nowcoder.com/discuss/933023499399024640
