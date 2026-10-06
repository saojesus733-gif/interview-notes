---
title: 跨域与 CORS
category: 计算机网络
tags: [CORS, HTTP]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

什么是同源策略？为什么会有跨域问题，CORS 的预检请求（OPTIONS）是怎么回事？

## 核心答案

- **同源策略**：协议、域名、端口三者完全相同才算同源，是浏览器隔离恶意文档、限制跨源读取的安全基石；
- **跨域**：任一不同即跨域，`fetch`/`XMLHttpRequest` 的响应会被浏览器拦截（请求已发出、服务端已返回，只是浏览器不给 JS 读取）；
- **简单请求**：方法为 `GET`/`POST`/`HEAD`，且头部均为安全字段、`Content-Type` 为 `text/plain`/`form-urlencoded`/`multipart/form-data`，直接发送；
- **预检请求**：不满足简单请求条件（如带 `Authorization`、`Content-Type: application/json`、自定义头，或 `PUT`/`DELETE`），浏览器先发 `OPTIONS` 询问服务端是否允许，通过后才发真实请求；
- 服务端用 `Access-Control-Allow-Origin` 等响应头放行，`Access-Control-Max-Age` 可缓存预检结果、减少 OPTIONS 次数。

常见解决方式：CORS（标准做法）、开发环境或线上用 Nginx/Vite 反向代理、JSONP（仅 GET，已过时）、`postMessage`。

## 深度解析

- 追问点：预检为什么存在？让服务端有机会在真正执行带副作用的请求前确认跨域权限，保护老服务器；
- 常见误区：简单请求其实已经到达服务器，副作用可能已发生——这也是 CSRF 防御必须独立做的原因；
- 常见误区：反向代理不产生跨域，因为浏览器看到的是同源请求；带 Cookie 跨域时 `credentials` 与 `Allow-Origin: *` 不能同时成立；
- 追问点：`Access-Control-Allow-Headers`/`Allow-Methods` 分别约束什么？预检响应中声明真实请求允许携带的头与方法；
- 排障思路：预检失败看浏览器 Network 里 OPTIONS 的状态码与响应头，缺哪个 `Access-Control-*` 头就补哪个。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Cookie、Session、Token（JWT）的区别](/network/cookie-session-jwt)
- [常见 Web 攻击：XSS、CSRF、SQL 注入](/network/web-security-xss-csrf)
- [HTTP 常见状态码](/network/http-status-codes)
