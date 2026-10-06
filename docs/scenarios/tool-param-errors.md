---
title: 场景：工具调用参数错误频发的治理
category: 场景实战
tags: [工具调用, Function Calling, Prompt, 场景题]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Agent 调用内部查询工具时经常传错参数：日期格式忽对忽错、把用户昵称当 ID 传入、偶尔编造出不存在的枚举值。怎么系统性治理？

## 核心答案

**逐类归因 + 对症下药**：

1. **格式错（日期忽对忽错）**：
   - Schema 里收紧格式约束（`format: date`、pattern），参数描述给标准示例："YYYY-MM-DD，例如 2026-10-03"；
   - "今天/明天"这类相对时间不让模型猜——提供 `get_current_date` 工具或注入当前时间，模型先查再换算；
2. **语义错（昵称当 ID 传）**：
   - 参数命名与描述明确语义："user_id（系统内部数字 ID，非昵称），从 user_search 工具获得"；
   - 提供配套的"先查后用"工具链：`user_search(昵称) → user_id`，并在工具描述里写明调用顺序；
3. **编造枚举值**：
   - 枚举值全部写进 JSON Schema 的 `enum`，交给约束解码兜底；
   - 枚举动态变化时提供"列表查询工具"，不让模型凭记忆写；
4. **兜底**：执行层参数校验失败时，把**具体错误信息**回传模型（"user_id 必须是数字，你传了昵称，请先调用 user_search"），模型自纠一次；连续失败转人工/终止。

**验证**：建参数错误回归集（历史 badcase + 对抗样本），每次改工具描述/Schema 跑通过率对比。

## 深度解析

- 工具描述是被低估的"Prompt 资产"：`description` 写"什么时候不该用我"、参数写反例，往往比换模型见效更快；
- 加分点：区分三类错误的来源不同——格式错是解码层问题（Schema 约束解决）、语义错是上下文问题（信息不足，补工具链）、编造是知识问题（枚举注入）——归因错了优化就白做；
- 高频错参数的工具值得"收敛设计"：减少自由参数（如只传订单号，其余服务端反查），把不确定性从模型侧挪到代码侧。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Tool Calling 机制](/agent-memory-tools/tool-calling-mechanism)
- [工具设计原则与 MCP](/agent-memory-tools/tool-design-principles-mcp)
- [结构化输出](/prompt-engineering/structured-output)
