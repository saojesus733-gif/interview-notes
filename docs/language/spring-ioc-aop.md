---
title: Spring IOC 与 AOP 的原理
category: 编程语言
tags: [Spring, IOC, AOP]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

谈谈你对 Spring IOC 和 AOP 的理解？AOP 的动态代理如何选择，循环依赖为什么默认单例的情况下能解决？

## 核心答案

- **IOC/DI**：对象的创建和依赖装配交给容器管理，控制权从程序员反转给容器；DI 是实现手段（构造器/Setter/字段注入）；
- **两个容器**：BeanFactory 是最底层容器（懒加载）；ApplicationContext 是高级容器，增加事件、国际化、资源加载，启动时预创建单例；
- **AOP 本质**：动态代理织入横切逻辑——目标类实现了接口用 JDK 动态代理（Proxy + InvocationHandler，基于接口反射）；没有接口用 CGLIB（字节码生成子类，final 方法无法代理）；
- **应用场景**：声明式事务 @Transactional、日志与监控埋点、接口限流与鉴权、缓存注解等横切关注点；
- **循环依赖**：A 依赖 B、B 依赖 A，Spring 用三级缓存（成品池 / 半成品池 / ObjectFactory 工厂）在实例化后、注入前提前暴露早期引用；
- **能解决的前提**：仅单例 + Setter/字段注入的循环依赖可解；构造器注入和原型 Bean 的循环依赖直接报错。

## 深度解析

- 三级缓存为什么放工厂而非半成品：AOP 代理本应在初始化后才生成，工厂保证「需要被循环依赖时才提前生成代理且只生成一次」，不需要时仍走正常生命周期。
- 流程：A 实例化后把 ObjectFactory 放入三级缓存 → 属性填充发现要 B → B 创建时从三级缓存拿到 A 的早期引用 → B 完成 → A 继续注入并完成，最终两者都是成品。
- 事务失效的高频原因都源于「AOP 是代理」：同类内部 this 调用绕过代理、方法非 public、异常被 catch 吞掉、rollbackFor 不匹配。

```java
@Aspect
@Component
public class LogAspect {
    @Around("execution(* com.example.service..*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        // 前置日志 → 执行目标方法 → 后置日志
        return pjp.proceed();
    }
}
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Spring Bean 的生命周期](/language/spring-bean-lifecycle)
- [线程池的核心参数与工作流程](/language/threadpool-params)
