---
title: 手写对话窗口的 Token 裁剪
category: 手写编程
tags: [手写题, 上下文工程, Token]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

手写一个函数：输入消息列表（含 system、多轮 user/assistant 消息）和 token 预算，输出裁剪后的消息列表。要求 system 与最近消息必留，中间历史从最旧开始丢。

## 核心答案

1. **策略**：保留头（system，任务契约）+ 保留尾（最近 keep_recent 条，含当前问题）+ 中间历史按预算从旧到新丢弃；
2. **进阶**：被丢掉的中间历史可替换为一条摘要消息（"此前对话摘要：……"），保信息不保原文；
3. **实现要点**：token 计数用 tokenizer（无 tokenizer 时可用 `len(text) * 系数` 估算）；裁剪只动"喂给模型的视图"，不修改持久化历史。

## 深度解析

参考实现（伪代码风格 Python，token 计数以函数抽象）：

```python
def trim(messages, budget, count_tokens, keep_recent=4):
    system = [m for m in messages if m.role == "system"]
    rest   = [m for m in messages if m.role != "system"]
    used = sum(count_tokens(m) for m in system) + sum(count_tokens(m) for m in rest[-keep_recent:])
    kept, reserve = [], rest[:-keep_recent]
    for m in reversed(reserve):                    # 从新到旧尽量多保留
        cost = count_tokens(m)
        if used + cost <= budget:
            kept.insert(0, m); used += cost
    summary = summarize(reserve[:-len(kept)]) if reserve[:-len(kept)] else None
    return system + ([summary_msg(summary)] if summary else []) + kept + rest[-keep_recent:]
```

- 易错点：忘记给**输出**预留 token（预算 = 输入上限 - max_tokens）；只从尾部截断把 system 弄丢；
- 追问：为什么"从旧到新丢"而不是均匀丢？→ 近因信息相关性最高，远期信息可摘要化；
- 延伸：生产实现会做摘要缓存（对已裁剪段落只摘要一次），避免每轮重复调用摘要模型。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Token 超限时的上下文裁剪策略](/agent-memory-tools/context-trimming)
- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
