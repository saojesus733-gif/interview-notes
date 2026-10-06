---
title: Prompt 设计原则与结构化 Prompt
category: Prompt 工程
tags: [Prompt, 结构化输出, LLM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

写出高质量 Prompt 有哪些通用原则？如何让模型稳定输出结构化结果？

## 核心答案

**设计原则**：

1. **指令清晰具体**：任务、背景、约束写明确，避免模糊表述（「写好一点」→ 定义什么叫好）；
2. **结构化排版**：用标题、分隔符（XML 标签 / Markdown 分节）把指令、资料、问题分开，降低歧义；
3. **给角色与受众**：明确「你是谁、写给谁看」；
4. **明确输出格式**：要求 JSON / 表格 / 固定字段，并给出示例；
5. **给范例（few-shot）**：示例比描述更能统一格式与口径；
6. **复杂任务拆步骤**：把多步任务分解成有序指令，或拆成多次调用。

**稳定结构化输出的手段**：

1. Prompt 中给出 JSON Schema 或字段级说明 + 示例；
2. 使用模型/平台的 JSON Mode 或结构化输出能力（按 Schema 约束解码）；
3. 应用层兜底：解析失败自动重试（把报错信息带回给模型修正）；
4. 低温采样，减少格式抖动。

## 深度解析

- 结构化输出的可靠性排序：原生 Schema 约束解码 > JSON Mode > 纯 Prompt 约定。前两者从解码层面保证合法 JSON，后者只是「软约束」。
- 指令冲突是常见坑：System Prompt 与用户输入、前文示例互相矛盾时，模型行为不稳定； Prompt 应做「单一事实来源」。
- Prompt 也是代码：要进版本管理、要配评估集、改一处要回归测试。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [结构化输出](/prompt-engineering/structured-output)
- [System Prompt 设计](/prompt-engineering/system-prompt-design)
- [Prompt 常见反模式](/prompt-engineering/prompt-anti-patterns)
