# 场景实战

本分类收录 AI Agent / LLM 应用岗的开放场景题：线上问题排查、事故处置、成本优化、安全评审等——考的不是背概念，而是把知识组织成"可执行的工程动作"的能力。

## 题目列表

| 题目 | 重要程度 | 标签 |
| --- | --- | --- |
| [RAG 问答答非所问的排查](/scenarios/rag-answer-misalignment) | ⭐⭐⭐ | RAG, 排查, 评估, 场景题, 面试高频 |
| [Agent 死循环与预算失控治理](/scenarios/agent-infinite-loop) | ⭐⭐⭐ | Agent, 稳定性, 成本, 场景题, 面试高频 |
| [幻觉引发的业务事故处置](/scenarios/hallucination-business-incident) | ⭐⭐⭐ | 幻觉, Agent, 安全, 场景题, 面试高频 |
| [几百页 PDF 问答的成本优化](/scenarios/long-doc-qa-cost) | ⭐⭐ | RAG, 上下文窗口, 成本, 场景题 |
| [知识库频繁更新导致的过期内容问题](/scenarios/knowledge-staleness) | ⭐⭐ | RAG, 数据管道, 元数据, 场景题 |
| [多轮对话中的意图漂移](/scenarios/multi-turn-context-conflict) | ⭐⭐ | 多轮对话, 记忆, Agent, 场景题, 面试高频 |
| [工具调用参数错误频发的治理](/scenarios/tool-param-errors) | ⭐⭐ | 工具调用, Function Calling, Prompt, 场景题 |
| [慢而不稳的第三方接口不拖垮 Agent](/scenarios/slow-upstream-api) | ⭐ | 稳定性, 工具调用, 架构设计, 场景题 |
| [发票字段抽取合格率从 85% 到 98%](/scenarios/extraction-quality) | ⭐⭐⭐ | 结构化输出, 评估, Prompt, 场景题, 面试高频 |
| [Prompt 管理的工程化改造](/scenarios/prompt-maintenance-chaos) | ⭐⭐ | Prompt, 工程化, 评估, 场景题 |
| [小模型替换大模型的灰度验证](/scenarios/model-router-rollout) | ⭐⭐ | 模型选型, 成本, 灰度发布, 场景题 |
| [带转账能力 Agent 的上线安全评审](/scenarios/agent-launch-review) | ⭐⭐⭐ | 安全, Agent, HITL, 场景题, 面试高频 |
| [Text2SQL / ChatBI 的设计](/scenarios/text2sql-chatbi) | ⭐⭐⭐ | Text2SQL, Agent, 场景题, 面试高频 |
| [语音 Agent 的延迟与打断](/scenarios/voice-agent-latency) | ⭐⭐ | 语音, Agent, 延迟, 场景题 |
| [从零到一搭建智能问答](/scenarios/zero-to-one-agent-platform) | ⭐⭐⭐ | 冷启动, RAG, Agent, 场景题, 面试高频 |
| [模型 API 下线或涨价的迁移](/scenarios/model-deprecation-migration) | ⭐ | 模型迁移, 模型选型, 评估, 场景题 |
| [没有任何标注数据怎么建评估集](/scenarios/eval-cold-start) | ⭐⭐ | 评估, 冷启动, 场景题 |
| [多知识源的路由与融合](/scenarios/multi-source-routing) | ⭐⭐ | 路由, RAG, Agent, 场景题 |

## 场景题答题心法

1. **先归因再动手**：用数据把问题拆成几类（检索/生成/输入/超纲），资源投给最大头；
2. **分层防御**：模型层管体验，代码层管兜底——高危语义绝不依赖模型自觉；
3. **闭环意识**：每次优化都要有评估集回归 + 灰度验证 + 监控看板，说得出"怎么验证有效"。
