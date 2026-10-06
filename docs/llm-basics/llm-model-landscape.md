---
title: GPT / Claude / Qwen / DeepSeek 各有什么长短？业务怎么选模型？
category: LLM 基础
tags: [模型选型, Qwen, DeepSeek, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

现在模型这么多：GPT、Claude、Qwen、DeepSeek……各有什么长短？如果让你为业务选模型，你的方法论是什么？

## 核心答案

**先给评估框架（四个维度），再谈具体模型**：能力上限（推理/代码/多模态/工具调用）、中文能力、成本（单价与吞吐）、部署形态（海外 API / 国内 API / 私有化）。

**主流模型的典型画像**（版本迭代快，以面试时点的公开口碑为准）：

- **GPT（OpenAI）**：综合能力与生态标杆，Function Calling/多模态成熟；国内业务有合规接入与成本考量；
- **Claude（Anthropic）**：长文写作质量、代码生成与 Agent 任务表现突出，超长上下文强；同样以海外 API 为主；
- **Qwen（阿里）**：中文能力强、开源矩阵齐全（可私有化）、DashScope API 完整、Qwen-VL 多模态——国内业务与私有化的主力选项之一；
- **DeepSeek**：推理与代码能力强、开源、API 性价比极高；高峰期稳定性与多模态生态相对弱一些。

**选型方法论**：

1. 用**自己业务的评测集**跑对比（通用榜单不代表你的任务）；
2. 小流量灰度验证质量代理指标；
3. 按"任务分级"路由：复杂推理用旗舰、简单任务用小模型（呼应成本优化）；
4. 架构上走统一网关，保持可替换。

## 深度解析

- 加分点：主动声明"模型迭代很快，具体优劣有时效性，我更想讲选型方法论"——这比背结论高级且不会翻车；
- 结合简历：企业办公助手用的 DashScope/Qwen 系——可以讲"选 Qwen 的理由：中文 + 私有化可能性 + 成本"；
- 雷区：只报一个模型名字当答案；贬低任何一家（用"相对优势/相对取舍"的措辞）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [开源模型 vs 闭源模型选型](/llm-basics/open-vs-closed-source-models)
- [LLM 应用成本控制](/evaluation-deployment/cost-optimization)
- [LLM Gateway 统一网关设计](/system-design/llm-gateway)
