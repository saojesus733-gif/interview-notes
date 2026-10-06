---
title: System Prompt 设计
category: Prompt 工程
tags: [System Prompt, Prompt, Agent, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

System Prompt 应该包含哪些内容？设计时有哪些关键考虑？

## 核心答案

System Prompt 是应用的「产品说明书 + 规章制度」，典型结构：

1. **角色与目标**：你是谁、为谁服务、成功标准是什么；
2. **能力边界**：能做什么、不能做什么、遇到超范围怎么拒答/引导；
3. **行为规范**：语气、语言、长度、格式要求；
4. **工具使用规则**：何时必须/禁止调用某工具、参数怎么取、调用前是否要澄清；
5. **安全与合规**：敏感内容红线、免责话术、隐私要求；
6. **输出契约**：结构化格式定义（配合 Schema）；
7. **工作流约定**：多步骤任务的标准动作序列（先思考再行动、先检索再回答）。

**关键考虑**：

- System Prompt 放**稳定不变**的规则，动态内容（检索结果、历史对话）放用户消息区，层次分离；
- 规则要少而硬：互相冲突或大量「软建议」会稀释遵循度；
- System Prompt 是核心资产：版本管理 + 评估集回归，改一句要跑全量测试。

## 深度解析

- 模型对 System 的遵循度总体高于用户消息，但**不是绝对权威**——长对话、强对抗输入下可能被稀释，安全约束必须配合外层防御（过滤、权限、HITL），不能单点依赖。
- 调试技巧：让模型复述它理解的规则、或解释为什么违反了规则，能快速定位 Prompt 歧义。
- 超长 System Prompt 会摊薄注意力，定期审计：删掉从未触发效果的条款。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Prompt 注入攻击与防御](/prompt-engineering/prompt-injection-defense)
- [Prompt 设计原则](/prompt-engineering/prompt-design-principles)
- [Agent 安全与权限控制](/evaluation-deployment/agent-security)
