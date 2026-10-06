---
title: 手写固定长度 + Overlap 的 Chunking
category: 手写编程
tags: [手写题, Chunking, RAG]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

手写一个文档切分函数：把长文本切成不超过 max_len 的块，相邻块之间保留 overlap 重叠，并尽量在句子边界处切开而不是硬截断。

## 核心答案

1. **思路**：滑动窗口式切分——每块从上一块尾部回退 overlap 个字符开始；切点优先落在分隔符（`\n`、`。`、`！`）上，找不到再硬切；
2. **关键细节**：
   - overlap 必须 < max_len，否则死循环；
   - 切点回退时不要越过 overlap 区间，否则重叠丢失；
   - 剩余尾巴不足一块时也要输出（非空）；
3. **复杂度**：O(n)。

## 深度解析

参考实现（Python）：

```python
def chunk(text, max_len=500, overlap=50):
    seps = ["\n", "。", "！", "？", "；"]
    chunks, start = [], 0
    while start < len(text):
        end = min(start + max_len, len(text))
        if end < len(text):  # 还有剩余, 尝试回退到分隔符
            for sep in seps:
                p = text.rfind(sep, start + overlap, end)
                if p != -1:
                    end = p + len(sep)  # 分隔符归入前一块
                    break
        chunks.append(text[start:end])
        start = max(end - overlap, start + 1)  # 防死循环
    return [c for c in chunks if c.strip()]
```

- 易错点：`start` 更新后没有保证前进（overlap ≥ max_len 时死循环）；rfind 的搜索区间写错；
- 追问：为什么按字符切不如按 token 切？→ 费用与模型窗口都按 token 计，字符数与 token 数非线性对应；
- 延伸：递归切分 = 依次尝试多级分隔符（段落→句子→词），即 LangChain RecursiveCharacterTextSplitter 的思想。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Chunk 切分策略](/rag/chunking-strategies)
- [手写 RRF 融合函数](/coding/implement-rrf)
