---
title: 迅雷 Agent 一面
category: 真实面经
tags: [迅雷, Agent, 一面, 面试实录]
importance: 3
mastery: 未掌握
source: 牛客网面经
---

## 问题

原帖完整记录（仅问题为主，括号内为作者现场回忆）。

## 核心答案

原文未提供完整答案，括号内是作者对现场作答/面试官反馈的回忆，如实保留。

## 深度解析

## 我的理解

（留空，后续自行填写）

## 关联题目

- [记忆复用难题：捞到类似对话后按旧方案还是新方案](/agent-memory-tools/memory-reuse-vs-new-solution)
- [意图识别怎么知道分对了：指标量化与相似问法](/agent-architecture/intent-recognition-quantification)
- [RAG 现在还能用吗：多方面分析（含 reranker 追问）](/rag/rag-still-relevant-debate)
- [写一个 MCP Server 应该怎么做](/agent-memory-tools/mcp-server-implementation-steps)
- [AI Native 团队的开发规范：CLAUDE.md 之外怎么办](/prompt-engineering/ai-native-dev-conventions)

## 原始面经

> 来源：牛客网，发布于 09-23，作者 [已脱敏]（西北大学 Java），时长 1h28min，「知识范围比较广」，无手撕
> 链接：https://www.nowcoder.com/discuss/932392798559432704

1. 项目深挖，意图识别你们怎么知道意图分的就是对的，你们指标量化吗？ 那如果用户两次提问相似的问法但是实际意图不一样你们怎么去判断出来？（不论用户说什么，进来之后，本身 idealab 会清晰地记录一个文档（所以支持混合检索），不同的路由内容。状态机+确认？ 结果多方向加权之后（不含RAG），得到一个结果，本地单独model出置信度，最后有兜底。）

记忆混乱怎么优化的（多层，具体情况具体分析）？ 深挖（如果记忆中能捞到之前有类似对话的话，你的Agent怎么让他知道应该按照之前的方案做还是应该用一个新的方案？）（what? 完全不知道该怎么答好吧）（面试官说他们尝试了很多方法没有得到好的结果，想看看你既然在xx实习过，想看看你们有没有好的方法，力竭了，我纯菜）

2. RAG，你怎么看的？ 现在很多说法说RAG不能用了，多方面分析一下，以及LLM Wiki。

追问，那你觉得reranker对召回之后的优化到底能达到什么地步？底层原理是什么（从transformer的角度说一下），重召回是以topK还是topP返回的？ transformer底层说一下。

3. chunk方式，如果分片，片之间怎么联系？索引存DB

4. Skill原理说一下

5. 要让你写一个MCP的话，应该怎么做（@Tools @Param，将你的工具注册后对外暴露，在你要用的服务引入），接入方式有哪些stdio等

6. 如果你们多人开发，想要有一个开发规范，应该怎么做？（原始开发约定俗成），现在AI Native开发，想要让大家遵守，怎么办? 如果CLAUDE.MD的话，大家Coding Agent 不一样，怎么办？

7. 八股，concurrent包的内容，线程池有几种创建方式Excutor，几种方式。

8. Spring Bean生命周期
