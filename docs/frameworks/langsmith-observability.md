---
title: 用 LangSmith 怎么定位 Agent 某一轮推理失败？
category: 框架
tags: [LangSmith, 可观测性, LangGraph, 排查]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Agent 跑了 15 步最后答错了。用 LangSmith 的话，你怎么定位到底是哪一轮推理出的问题？

## 核心答案

**LangSmith 的三层能力**：Tracing（执行轨迹）、Datasets & Evaluation（评估集回归）、Prompt 管理。

**定位失败的流程**：

1. **找到那次执行**：按 thread_id / session / 用户 / 时间过滤 runs，Agent 的一次完整图执行是一棵 **trace 树**——节点、LLM 调用、工具调用各是一个 span，带输入输出、延迟、token 数；
2. **沿轨迹回看**：从最终输出往上找"第一个不对劲的 span"——常见异常点：某节点输入的上下文里缺关键信息（检索没召回）、某次 LLM 调用的输出格式不符（解析失败）、某工具返回错误被当成了 Observation；
3. **看该步的完整输入**：模型之所以这么答，是因为它"看到了什么"——把该 LLM 调用的完整 Prompt 拉出来复盘；
4. **归因**：上下文缺失 → 检索问题；指令被忽略 → Prompt 问题；工具失败 → 工具/权限问题；
5. **闭环**：把失败 case 存进 LangSmith 数据集，修复后跑回归，防止复发。

## 深度解析

- 加分点：trace 的意义——Agent 排障必须看**轨迹**而不是只看最终输出，"哪一步开始偏的"比"最后错了"重要；
- 替代与自建：Langfuse 开源可自托管，或基于 OpenTelemetry 自建 gen-ai span（呼应可观测性题）；生产全量 tracing 有隐私与成本问题——错误全量 + 正常抽样；
- 雷区：说"打了日志就能查"——非结构化日志串不起多轮多调用的因果链。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [可观测性与 tracing 体系](/evaluation-deployment/observability-tracing)
- [Callback 与 Stream 的区别](/frameworks/callback-vs-stream)
- [LLM 应用的监控与质量退化检测](/evaluation-deployment/monitoring-quality-drift)
