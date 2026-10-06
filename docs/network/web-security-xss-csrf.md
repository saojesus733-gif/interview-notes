---
title: 常见 Web 攻击：XSS、CSRF、SQL 注入
category: 计算机网络
tags: [安全, XSS, CSRF]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

XSS、CSRF、SQL 注入这三类攻击的原理分别是什么？
针对每一种，你的防御清单是什么？

## 核心答案

- **XSS（跨站脚本）**：攻击者把恶意脚本注入页面（如评论区插入 `<script>`），其他用户浏览时脚本在其浏览器执行，窃取 Cookie 或伪造操作；
- XSS 防御：输入过滤 + 输出转义（HTML 实体）、Cookie 设 `HttpOnly`、CSP 限制脚本来源、框架默认转义、慎用 `dangerouslySetInnerHTML`/`v-html`；
- **CSRF（跨站请求伪造）**：借用用户已登录身份，诱导浏览器向目标站发请求（Cookie 自动携带），以用户名义执行转账等操作；
- CSRF 防御：CSRF Token（表单或请求头携带随机值）、`SameSite` Cookie 属性、校验 `Referer`/`Origin`、关键操作二次验证；
- **SQL 注入**：把 SQL 片段拼进用户输入（如 `' OR '1'='1`）改变查询语义，导致拖库、绕过登录或越权；
- SQL 注入防御：**参数化查询/预编译**（根本手段）、ORM、最小权限数据库账号、严禁拼接 SQL 字符串；
- 共同原则：不信任任何用户输入，前后端双重校验，最小权限 + 纵深防御。

## 深度解析

- 三者本质不同：XSS 偷「浏览器中的身份」，CSRF 借「浏览器自动带凭证」的机制，SQL 注入打「代码与数据不分离」；
- 追问点：XSS 的存储型/反射型/DOM 型区别——存储型入库持久危害大，反射型经链接触发，DOM 型纯前端拼接；
- 追问点：CSP 为什么能防 XSS？`Content-Security-Policy` 从响应头限制脚本加载与执行来源，即使脚本被注入也难以运行；
- 追问点：CSRF Token 为什么有效？攻击者页面受同源策略限制，读不到目标域的 Token，伪造请求带不上合法值；
- 常见误区：前端转义不能替代后端防御；HTTPS 不防这三类攻击，它们与传输加密无关；
- 常见误区：只过滤 `<script>` 关键字远远不够，`onerror` 事件、`javascript:` 伪协议、编码变体都能绕过。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Cookie、Session、Token（JWT）的区别](/network/cookie-session-jwt)
- [跨域与 CORS](/network/cors-cross-origin)
