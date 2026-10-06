# 名词解释速查手册

按领域分组的 AI 应用开发术语表。每条一两句话讲清本质；想深入的点链接刷对应题目。

## 模型基础

- **LLM（大语言模型）**：在海量文本上预训练的生成式模型，按概率逐 token 生成文本。理解它"只是预测下一个词"是理解幻觉和温度的根基。
- **Token**：模型处理文本的最小单位，约等于 0.5~1.5 个汉字或 0.75 个英文单词。计费、上下文长度限制都以 token 计。
- **Context Window（上下文窗口）**：模型一次能"看到"的最大 token 数。超窗要么截断要么报错——上下文工程就是围绕它展开的 → [上下文工程核心](/prompt-engineering/context-engineering-core)
- **Temperature（温度）**：采样随机度。0 ≈ 稳定复现，1+ ≈ 更发散。抽取类任务用低温度，创意生成调高。
- **幻觉（Hallucination）**：模型一本正经地编造事实。RAG 和来源引用是对抗手段 → [RAG 幻觉](/rag/rag-hallucination)
- **SFT（监督微调）/ LoRA**：SFT 用标注数据调整模型行为；LoRA 是低秩适配的轻量微调法，只训练小矩阵，成本远低于全量微调。
- **量化（Quantization）**：把模型权重从 FP16 压到 INT8/INT4，省显存换少量精度损失 → [量化与边缘部署](/evaluation-deployment/quantization-edge-deployment)
- **多模态（Multimodal）**：能同时处理文字、图像、音频的模型，如 Qwen-VL（看图说话、图片编辑）。

## Prompt 与上下文工程

- **System Prompt**：设定模型角色、规则和边界的高优先级指令，用户看不到。 → [系统提示词设计](/prompt-engineering/system-prompt-design)
- **Few-shot**：在 prompt 里放几个输入输出示例，让模型模仿格式与风格 → [Few-shot 策略](/prompt-engineering/few-shot-strategies)
- **CoT（思维链）**：让模型"先写推理过程再给答案"，显著提升复杂任务准确率 → [CoT 与 ReAct](/prompt-engineering/cot-react-prompting)
- **结构化输出**：强制模型按 JSON Schema 返回（JSON mode / function calling / with_structured_output），是工程可靠性的基石 → [结构化输出](/prompt-engineering/structured-output)
- **Prompt 注入**：用户或外部内容里藏指令劫持模型行为。防御靠输入过滤、权限最小化、输出审查 → [Prompt 注入防御](/prompt-engineering/prompt-injection-defense)
- **上下文工程（Context Engineering）**：比 prompt 工程大一号的概念——管理送进窗口的一切内容（系统指令、历史、检索结果、工具输出）的取舍与排布。

## Agent 与工具

- **Agent**：能让 LLM 自主"思考 → 调工具 → 看结果 → 再决策"循环执行的系统。四要素：模型 + 工具 + 记忆 + 编排 → [Agent 四大组件](/agent-architecture/agent-four-components)
- **Workflow（工作流）**：步骤和路径预先编排好的确定性流程，LLM 只在节点内干活。和 Agent 的边界是面试高频题 → [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
- **Tool Calling / Function Calling**：模型输出结构化的"调用意图"（函数名 + 参数），由程序执行后把结果回填给模型 → [工具调用机制](/agent-memory-tools/tool-calling-mechanism)
- **MCP（Model Context Protocol）**：Anthropic 推的工具接入标准协议——工具方实现一次 MCP Server，所有支持的客户端都能用，解决 M×N 集成问题 → [MCP 详解](/agent-memory-tools/tool-design-principles-mcp)、[动手写一个 MCP](/agent-memory-tools/mcp-server-implementation-steps)
- **Skill**：比工具更高层的"能力包"——一组提示词、脚本和资源的组合，让 Agent 学会一类任务。和 MCP 的区别：MCP 是连接协议，Skill 是能力的封装与复用 → [Skill / MCP / Rule 的区别](/agent-memory-tools/skill-mcp-rule)
- **A2A（Agent2Agent）**：Google 推的 Agent 之间互操作协议。一句话：MCP 垂直连工具，A2A 水平连 Agent → [A2A 与 MCP 的区别](/agent-memory-tools/a2a-vs-mcp)
- **ReAct**：经典的 Agent 循环模式——Reason（推理）→ Act（行动）→ Observe（观察结果）循环直到完成 → [ReAct 核心思想](/agent-architecture/react-framework-core-idea)
- **Plan-and-Execute**：先让模型出完整计划，再逐步执行的模式，长任务上比 ReAct 稳 → [Plan-and-Execute 与 ReAct 对比](/agent-architecture/plan-and-execute-vs-react)
- **多 Agent 编排**：多个 Agent 分工协作（主管分派 / 专家执行），解决单 Agent 上下文过载和工具过载 → [多 Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
- **Interrupt / Human-in-the-Loop**：Agent 执行到关键点暂停等人类确认或补充输入，确认后从断点恢复 → [LangGraph Interrupt](/frameworks/langgraph-interrupt)、[Human-in-the-Loop](/system-design/human-in-the-loop)
- **Agent Runtime / Harness**：模型外面的工程壳——工具执行、上下文装配、权限控制、循环终止。剪映面经原题 → [Harness 工程](/agent-architecture/coding-agent-harness-modules)
- **短期/长期记忆**：会话内的工作记忆（对话历史、当前状态）vs 跨会话持久记忆（用户偏好、历史结论）→ [工作记忆与长期记忆](/agent-memory-tools/working-vs-long-term-memory)
- **Reflexion**：Agent 对自己的失败输出做反思总结，把教训写进记忆指导下次 → [Reflexion 自我修正](/agent-architecture/reflexion-self-correction)

## RAG（检索增强生成）

- **RAG**：回答前先从知识库检索相关材料，让模型"开卷考试"。解决模型知识过期、私有知识缺失的问题 → [RAG 的定义与价值](/rag/rag-definition-value)、[RAG vs 微调怎么选](/rag/rag-vs-finetune)
- **Embedding（向量化）**：把文本/图片映射成高维向量，语义相近则向量相近——检索的数学基础 → [Embedding 选型](/rag/embedding-selection)
- **向量数据库**：专存向量并支持相似度检索的库（pgvector、Milvus、Redis 向量索引等）→ [向量检索原理](/rag/vector-search-principle)
- **Chunk（分块）**：把文档切成检索粒度的片段。切太碎丢上下文，切太大稀释相关性 → [分块策略](/rag/chunking-strategies)
- **TopK**：召回时取相似度最高的 K 条结果，检索场景的标准参数。
- **混合检索**：BM25 关键词检索 + 向量语义检索双路召回，互补短板 → [BM25 与 RRF](/rag/hybrid-retrieval-bm25-rrf)
- **Rerank（重排）**：用更重的模型（Cross-Encoder）对召回结果精细排序，提升精度 → [Bi-Encoder 与 Cross-Encoder](/rag/rerank-bi-cross-encoder)
- **RAGAS**：RAG 评测框架，从忠实度、答案相关性、上下文召回等维度量化 → [RAGAS 框架](/rag/ragas-framework)

## 工程与部署

- **SSE（Server-Sent Events）**：服务器向浏览器单向推送的 HTTP 流式协议，LLM 打字机效果的标准实现。只支持 GET 的 EventSource 和 fetch+ReadableStream 的取舍是面试点 → [流式 SSE](/system-design/streaming-sse)
- **JWT**：无状态令牌认证——签名保证不可伪造，配合 Redis 黑名单实现"登出即失效"。
- **幂等（Idempotency）**：同一操作执行多次和一次结果相同。用唯一键约束 + upsert 实现，是同步/支付类系统的生命线。
- **降级（Fallback）**：主链路失败时自动切到备用路径（备用模型 → 检索拼接 → 兜底话术），保证服务永远有输出。
- **灰度发布**：新版本先放给小部分流量验证指标，再全量——AI 应用防"局部提优全局负优化"的手段 → [灰度与 A/B 发布](/evaluation-deployment/grayscale-ab-release)
- **死信队列**：反复处理失败的消息单独存放等待人工介入，不阻塞主流程。
- **评测集 / Golden Set**：人工核对的"标准问答对"集合，每次迭代后回归跑一遍，防止改 A 坏 B → [评估系统](/evaluation-deployment/evaluation-system)
- **LLM-as-a-Judge**：用强模型当裁判给弱模型输出打分，规模化替代人工评审 → [LLM-as-a-Judge](/evaluation-deployment/llm-as-a-judge)
- **可观测性 / Tracing**：记录 Agent 每一步的输入输出和耗时（LangSmith、OpenTelemetry），排查"模型为什么这么答"的必备设施 → [可观测性 Tracing](/evaluation-deployment/observability-tracing)
- **vLLM / PagedAttention**：推理加速框架，像操作系统管内存一样分页管理 KV Cache，吞吐量成倍提升 → [vLLM 与 PagedAttention](/evaluation-deployment/vllm-paged-attention)

---

> 记忆方法：把这些词按"模型的局限 → 用什么手段补"串成故事——知识过期就 RAG，不会用工具就 Tool Calling/MCP，不可靠就评测 + 灰度，太慢就 vLLM + 量化，不透明就 Tracing。面试聊到任何一词，都能顺势展开成你的技术叙事。
