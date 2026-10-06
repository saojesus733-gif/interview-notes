---
title: 反射与动态代理
category: 编程语言
tags: [反射, 动态代理, Java基础]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

反射有什么用，代价是什么？JDK 动态代理和 CGLIB 有什么区别？Spring AOP 是怎么选代理方式的？

## 核心答案

- **反射用途**：运行时获取类信息、调用方法、读写字段，绕过编译期检查；是框架「配置驱动」的基石；
- **反射代价**：方法查找与参数装箱开销大，比直接调用慢不少；频繁生成反射相关类可能撑大 Metaspace；实践中要缓存 Method/Field 对象、`setAccessible(true)`；
- **JDK 动态代理**：基于接口，运行时生成实现同样接口的代理类（$Proxy0），方法调用统一转发给 InvocationHandler；
- **CGLIB 代理**：基于继承，生成目标类的子类并重写非 final 方法，用 MethodInterceptor 拦截，不要求目标实现接口；
- **Spring AOP 选型**：目标实现了接口默认 JDK 动态代理，没实现接口用 CGLIB；`proxyTargetClass=true` 可强制全走 CGLIB（Spring Boot 2.x 起默认 CGLIB）；
- **框架应用**：Spring IOC 反射实例化 Bean 并按类型/名称注入，MyBatis 用动态代理生成 Mapper 实现，AOP 用代理织入事务、日志等增强。

## 深度解析

- MyBatis Mapper 一句话原理：调用 Mapper 接口方法实际进入动态代理的 InvocationHandler，按「接口全限定名 + 方法名」定位 SQL 并执行。

```java
// JDK 动态代理：接口 + InvocationHandler
UserService proxy = (UserService) Proxy.newProxyInstance(
    loader, new Class[]{UserService.class},
    (p, method, args) -> {
        System.out.println("前置增强：事务/日志");
        return method.invoke(target, args); // 反射调用真实对象
    });
```

- 常见误区：CGLIB 无法代理 final 类和 final/private 方法（子类没法重写）；JDK 代理对象只能强转成接口，不能强转成目标实现类。
- 追问点：Spring 事务为什么同类内部 this 调用会失效？——this 拿到的是原始对象而非代理对象，增强逻辑根本没有执行机会，必须从代理入口调用。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Spring IOC 与 AOP 的原理](/language/spring-ioc-aop)
- [Java 泛型与类型擦除](/language/generics-erasure)
