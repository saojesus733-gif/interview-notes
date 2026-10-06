---
title: 结构化输出（JSON Mode / Schema 约束）
category: Prompt 工程
tags: [结构化输出, JSON, Agent, 工具调用]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

如何让 LLM 的输出能被程序可靠解析？JSON Mode 和 Schema 约束有什么区别？

## 核心答案

**三个层次的可靠性（由弱到强）**：

1. **Prompt 约定**：在 Prompt 里描述期望格式并给示例。成本最低，但属于软约束，偶发解析失败；
2. **JSON Mode**：API 层面保证输出是合法 JSON（约束解码到合法语法），但不保证符合你的业务 Schema；
3. **Schema 约束（Structured Output）**：传入 JSON Schema，解码器按 Schema 生成，字段、类型、枚举都受控。

**工程兜底**（无论哪层都要有）：

```text
调用模型 → 解析输出
  ├─ 成功 → 校验业务字段（必填/取值范围）
  └─ 失败 → 把解析错误 + 原输出回传模型要求修正 → 重试（上限 N 次）→ 降级路径
```

**为什么重要**：Agent 的工具调用、流程编排、批量抽取等场景，下游程序完全依赖输出可解析——结构化输出是 LLM 应用工程化的地基。

## 深度解析

- 实现原理是**约束解码**：解码时屏蔽不符合 Schema 的 token（基于语法/正则/JSON 解析状态机），从采样层面保证合法，而不是靠模型「自觉」。
- 注意点：枚举值要写进 Schema 而不是只写在 Prompt；嵌套过深的 Schema 会拉高延迟与失败率；Schema 本身要进版本管理。
- 校验用 Pydantic / zod 等库做二次业务校验，语法合法 ≠ 业务正确。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Tool Calling 机制](/agent-memory-tools/tool-calling-mechanism)
- [Prompt 设计原则](/prompt-engineering/prompt-design-principles)
