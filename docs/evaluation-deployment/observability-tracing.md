---
title: 生产 LLM 应用的可观测性与 tracing 体系
category: 评估与部署
tags: [可观测性, tracing, OpenTelemetry, LangSmith]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

生产 LLM 应用的可观测性怎么做？出问题时怎么快速定位到"某一次调用"？和传统后端的可观测性有什么不同？

## 核心答案

**三支柱映射到 LLM 应用**：

1. **日志**：全量请求/响应（脱敏后）留痕，结构化存储，支持按会话回放；
2. **指标**：延迟（TTFT/P99）、错误率、token 与成本、质量代理指标（拒答率/负反馈率）；
3. **Trace（LLM 应用的核心增量）**：一次请求跨 **网关 → Agent 节点 → LLM 调用 → 工具执行** 的树状 span 链路，每个 span 记录输入、输出、耗时、token。

**与传统的差异**：传统可观测性看"服务是否健康"，LLM 应用还要看"每一步模型看到了什么、为什么这么答"——span 的输入输出内容（不只是状态码）是排障主体。

**定位流程**：用户反馈/告警 → 用 trace id 串起完整链路 → 找慢/错 span → 检查该 span 的输入（上下文里有没有该有的信息）与输出（模型行为是否合理）→ 归因到检索/指令/工具/模型。

**落地要点**：trace id 从入口贯穿；采样策略（错误全量 + 正常抽样）控成本；PII 脱敏后才入库；工具与模型调用打成本标签（按租户分账）。

## 深度解析

- 标准与工具：OpenTelemetry 的 gen-ai 语义约定是通用底座；LangSmith（SaaS，与 LangGraph 无缝）、Langfuse（开源可自托管）是主流落地（呼应 LangSmith 题，两者选一句：要快用 SaaS，要数据自主用 Langfuse）；
- 加分点：trace 是"质量退化排查"的证据链——没有结构化 trace，多轮 Agent 的故障只能靠猜（呼应监控退化检测题）；
- 雷区：把可观测性等同"打日志"——非结构化日志无法重建多步因果链。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [用 LangSmith 定位某一轮推理失败](/frameworks/langsmith-observability)
- [LLM 应用的监控与质量退化检测](/evaluation-deployment/monitoring-quality-drift)
- [Callback 与 Stream 的区别](/frameworks/callback-vs-stream)
