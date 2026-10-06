---
title: Cookie、Session、Token（JWT）的区别
category: 计算机网络
tags: [Cookie, JWT, 认证]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Cookie、Session 和 JWT 各自是怎么实现身份识别的？分布式场景下你会怎么选？

## 核心答案

- **Cookie**：浏览器侧的存储机制，服务端通过 `Set-Cookie` 写入，之后同源请求自动携带；受 `HttpOnly`、`Secure`、`SameSite`、`Expires` 等属性约束；
- **Session**：状态存在**服务端**，Cookie 里只放 `SessionID`，服务端凭 ID 查到用户信息；集中存储，天然可主动失效；
- **JWT（Token）**：用户信息编码进令牌（`Header.Payload.Signature`），**状态在客户端**，服务端只用密钥验签，无需查库；
- JWT 优点：无状态、天然适合分布式与多端，签名防篡改；
- JWT 缺点：签发后**无法主动失效**（引入黑名单又变回有状态），Payload 只是 Base64 可解码，不能放敏感数据；
- 选型：单体或同域用 Session 简单可控；分布式/多端/跨域用 JWT，配合短有效期 + Refresh Token 折中。

## 深度解析

- Session 的扩展性问题：多台服务器需要共享 Session（粘性会话或 Redis 集中存储），这正是无状态 JWT 流行的原因；
- 追问点：JWT 如何做到「登出即失效」？黑名单、短过期时间 + Refresh Token 轮换、用户级版本号机制；
- 常见误区：JWT 防篡改但**不加密**，Payload 默认可读，需要保密要用 `JWE`；
- 追问点：分布式 Session 怎么存？Redis 集中存储 + 过期时间，或网关层粘性会话，各有代价；
- 安全对比：Cookie + Session 要防 CSRF（`SameSite`）；Token 放 `Authorization` 头可规避 Cookie 自动携带，但要防 XSS 窃取；
- 记住口诀：Session 是「服务端存状态」，JWT 是「客户端存状态、服务端验状态」。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [常见 Web 攻击：XSS、CSRF、SQL 注入](/network/web-security-xss-csrf)
- [跨域与 CORS](/network/cors-cross-origin)
- [HTTP 常见状态码](/network/http-status-codes)
