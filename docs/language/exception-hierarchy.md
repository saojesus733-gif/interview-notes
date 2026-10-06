---
title: Java 异常体系与实践
category: 编程语言
tags: [异常, Java基础]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

说说 Java 的异常体系结构？checked 和 unchecked 异常有什么区别？finally 里写 return 会发生什么？

## 核心答案

- **顶层结构**：Throwable 分两支——Error（程序无法处理，如 OutOfMemoryError、StackOverflowError）和 Exception；
- **Exception 两类**：RuntimeException 及其子类是 unchecked（非受检，如 NPE、数组越界），其余是 checked（受检，如 IOException，编译器强制 try-catch 或向上 throws）；
- **try-with-resources**：实现了 AutoCloseable 的资源在 try 括号内声明，结束自动逆序关闭，替代 finally 手动 close，杜绝资源泄漏；
- **finally 时机**：在 return 值确定之后、真正返回之前执行；即使 try 里有 return/throw 也会执行，只有 System.exit、JVM 崩溃、线程死亡才跳过；
- **吞异常陷阱**：finally 中 return 会丢弃 try 块里抛出的异常；finally 中再抛异常也会覆盖原异常，排查时丢失根因；
- **自定义异常**：业务错误定义 RuntimeException 子类（如 BizException）携带错误码，配合全局异常处理器统一返回。

## 深度解析

- finally 对返回值的影响：finally 里给基本类型局部变量赋值不影响已压栈的返回值，但修改引用对象的属性会生效——这也是规范禁止在 finally 里写 return 的原因。

```java
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    // 业务逻辑
} // 自动按逆序 close；关闭时若也抛异常，会作为 suppressed 挂在主异常上
```

- 常见误区：catch 后只打日志不处理等于吞异常；用异常做流程控制开销极大（填充栈轨迹）；一把抓 `catch (Exception e)` 会掩盖具体问题。
- 追问点：try-with-resources 里 try 和 close 同时抛异常怎么办？——try 的异常是主异常，close 的异常作为 suppressed exception 附加上，`getSuppressed()` 可取，不丢信息。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [JVM 内存区域划分](/language/jvm-memory-areas)
- [Spring Bean 的生命周期](/language/spring-bean-lifecycle)
