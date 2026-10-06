---
title: 手写简化版 ReAct 主循环
category: 手写编程
tags: [手写题, ReAct, Agent, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

用伪代码或 Python 手写一个最小的 Agent 执行循环：LLM 根据消息决定调用工具或给出最终答案，工具结果回填后继续，直到产出答案或超出步数限制。

## 核心答案

1. **骨架四要素**：消息列表（上下文）、工具注册表（名字→执行函数）、循环体（调模型→分支）、终止条件（最终答案 / 步数耗尽）；
2. **循环逻辑**：调 LLM → 若返回工具调用：执行工具、把结果作为 tool 消息追加、继续循环；否则返回 content；
3. **必须处理的工程点**：最大步数、工具执行异常（错误消息回填让模型自纠）、并行工具调用。

## 深度解析

参考实现（伪代码风格 Python）：

```python
MAX_STEPS = 15
def agent_loop(messages, tools, llm, max_steps=MAX_STEPS):
    for step in range(max_steps):
        resp = llm.chat(messages, tools=tools.schemas)
        if resp.tool_calls:                       # 模型要求调工具
            for tc in resp.tool_calls:            # 支持并行多工具
                try:
                    result = tools.execute(tc.name, tc.args)
                except Exception as e:            # 错误也是信息: 回填让模型自纠
                    result = f"工具执行失败: {e}"
                messages.append(tool_msg(tc.id, result))
        else:
            return resp.content                   # 终止: 最终答案
    return "已达最大步数, 输出当前进展: " + summarize(messages)
```

- 易错点：没有把工具结果作为独立消息类型追加（格式错会导致下一轮模型困惑）；异常直接抛出终止循环（应回填自愈）；
- 追问：怎么防止死循环？→ 最大步数 + 震荡检测（连续相同工具调用）；怎么加人审？→ 高危工具执行前插入确认点；
- 这段循环就是 LangGraph agent 节点 / 各家 Agent SDK 的内核，讲清它 = 讲懂 Agent 运行时。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [ReAct 框架核心思想与 TAO 循环](/agent-architecture/react-framework-core-idea)
- [Tool Calling 机制](/agent-memory-tools/tool-calling-mechanism)
- [Agent 执行循环与状态化设计](/agent-architecture/agent-execution-loop-state)
