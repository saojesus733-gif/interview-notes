---
title: Chunk 切分策略
category: RAG
tags: [Chunking, RAG, 检索, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

RAG 为什么要做 Chunk 切分？有哪些切分策略？chunk 大小怎么权衡？

## 核心答案

**为什么切分**：文档太长不能整篇进向量库与上下文；切分成小块才能精准召回「最相关的那几段」，同时控制 Prompt 长度。

**主要策略（由粗到细）**：

1. **固定长度切分**：按 token 数硬切 + overlap 重叠。简单可靠，是基线方案；
2. **递归切分**：按分隔符层级（段落 → 句子 → 词）递归下切，尽量保住自然边界。LangChain RecursiveCharacterTextSplitter 的思路，最常用；
3. **结构感知切分**：按 Markdown 标题、HTML 标签、代码块等文档结构切，保留语义单元完整性；
4. **语义切分**：按句间语义相似度突变点切分，效果更好但成本更高；
5. **父子块（Parent-Child）**：用小 chunk 做检索（精准），命中后返回其父块/大段（上下文完整）——检索粒度与生成粒度解耦。

**大小权衡**：

- chunk 太大：召回粒度粗、噪音多、一条 chunk 顶掉预算；
- chunk 太小：语义碎片化、上下文断裂、召回条数多；
- 经验：数百 token 起步（如 256~1024），配 10%~20% overlap，**用评估集对比效果**而不是拍脑袋。

## 深度解析

- 切分质量的上限是文档质量：清洗页眉页脚、修正乱码、保留标题层级（作为 chunk 元数据），比换任何切分算法收益都大；
- 元数据很值钱：来源、章节、时间、权限标签挂到 chunk 上，支持过滤检索与引用展示；
- 特殊内容特殊处理：表格按行/块转换、代码按函数切、FAQ 按 QA 对切，不要一个策略打天下。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Embedding 模型选型](/rag/embedding-selection)
- [Rerank 重排序的必要性](/rag/rerank-bi-cross-encoder)
- [RAG 的评估指标](/rag/rag-evaluation-metrics)
