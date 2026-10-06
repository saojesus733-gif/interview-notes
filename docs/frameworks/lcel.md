---
title: LCEL 表达式
category: 框架
tags: [LCEL, LangChain, 框架]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是 LCEL？它给 LangChain 应用带来了什么能力？

## 核心答案

- **LCEL（LangChain Expression Language）**：用**管道运算符 `|` 把组件声明式地组合成链**的语法——每个组件都是 Runnable（实现统一的 invoke / batch / stream 接口），管道把上一步输出接成下一步输入。

```python
chain = prompt | model | output_parser
chain.invoke({"topic": "RAG"})
```

- **带来的能力**（对管道内所有组件统一生效）：
  1. **流式**：stream() 逐 token 输出，管道自动串联流式传递；
  2. **批量/并发**：batch() 自动并行处理批量输入；
  3. **异步**：同一写法有异步版本（ainvoke / astream）；
  4. **fallback 重试**：链上可配置失败降级到备用模型；
  5. **可观测**：所有 Runnable 自动接入 LangSmith 追踪。

- **本质**：把「数据预处理 → 调模型 → 解析输出」这类固定流程声明成一个有向的数据管道，写法接近 Unix 管道，可读性和可组合性强。

## 深度解析

- LCEL 适合**确定性管道**（RAG 的取材-拼装-生成流程）；带循环、分支、人审的复杂 Agent 编排超出其表达力，那是 LangGraph 的领域——两者是「链」与「图」的层次关系。
- 与「手写函数串联」对比：手写更直白好调试，LCEL 换来的是流式/批量/重试/追踪的标准化，团队协作时统一风格价值更大。
- 面试注意：LCEL 细节 API 各版本有差异，讲清「Runnable 统一接口 + 管道组合 + 免费获得流式/并发」这一层即可。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangChain 的核心定位与主要组件](/frameworks/langchain-core-components)
- [LangGraph 的 Streaming API](/frameworks/langgraph-streaming)
