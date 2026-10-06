---
title: Chat Memory 与 Chat History 的区别
category: 记忆与工具
tags: [记忆, 多轮对话, 上下文工程]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

Chat Memory 和 Chat History 有什么区别？为什么要把它们分开设计？

## 核心答案

- **Chat History（对话历史）**：完整的、原始的消息日志——谁在什么时间说了什么、调了什么工具、返回了什么。**面向系统与人**：审计、回溯、排障、合规、展示给用户看聊天记录。
- **Chat Memory（对话记忆）**：从历史中**加工出来的、要喂给模型的上下文**——按 Token Budget 裁剪、摘要、排序后的视图。**面向模型**：让本次调用看到最有用的信息。

**三者关系**：

```text
原始消息流 → [持久化] → Chat History（全量，落库）
                    ↘ [裁剪/摘要/检索] → Chat Memory（模型视图，按需组装）
```

**为什么必须分开**：

1. **目标冲突**：History 求全（审计价值），Memory 求精（模型注意力有限）；
2. **生命周期不同**：History 按合规要求长期保留；Memory 只活在当前调用的上下文构建期；
3. **变更互不影响**：摘要策略、裁剪规则改了只影响 Memory 的组装逻辑，原始记录纹丝不动，随时可以重新加工。

## 深度解析

- 这是「事实源与视图」的经典分层：History 是事实源（source of truth），Memory 是投影（view）；任何时候可以从 History 重建 Memory，反之不行。
- 面试常见追问「历史都存了为什么还要摘要」：因为模型窗口和注意力有限，History 是给系统的，不是给模型的。
- 实现落点：LangChain/LangGraph 的 memory/checkpointer 体系、Spring AI 的 ChatMemory，本质上都在做「Memory 视图」这一层（各框架命名与能力有版本差异）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
- [对话记忆持久化](/agent-memory-tools/memory-persistence)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
