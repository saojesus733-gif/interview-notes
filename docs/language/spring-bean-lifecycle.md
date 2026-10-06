---
title: Spring Bean 的生命周期
category: 编程语言
tags: [Spring, Bean, 生命周期]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

描述一个 Spring Bean 从创建到销毁的完整生命周期？AOP 代理对象是在哪个阶段生成的？

## 核心答案

- **流程主线**：实例化（构造器/工厂方法）→ 属性填充（依赖注入）→ Aware 回调 → BeanPostProcessor 前置 → 初始化 → BeanPostProcessor 后置 → 放入单例池使用 → 容器关闭时销毁；
- **Aware 回调**：BeanNameAware、BeanFactoryAware、ApplicationContextAware，让 Bean 拿到容器底层资源；
- **初始化三件套（按序）**：@PostConstruct → InitializingBean.afterPropertiesSet() → init-method；
- **销毁对应（按序）**：@PreDestroy → DisposableBean.destroy() → destroy-method，容器 close() 或注册 shutdownHook 时触发；
- **BeanPostProcessor**：每个 Bean 初始化前后都会回调所有后置处理器，@Autowired 注入、AOP 代理都靠它实现；
- **AOP 代理生成时机**：初始化之后的 postProcessAfterInitialization 阶段，由 AbstractAutoProxyCreator 创建（发生循环依赖时提前到实例化后）。

## 深度解析

- @Autowired 的注入发生在属性填充阶段（AutowiredAnnotationBeanPostProcessor 完成），属于初始化之前——所以 @PostConstruct 里依赖已经就绪可用。
- 扩展点顺序口诀：「注解最先、先接口后配置」：@PostConstruct → afterPropertiesSet → init-method；销毁方向同理。
- singleton Bean 随容器生灭，容器负责销毁回调；prototype Bean 每次获取时创建，容器不管理其完整生命周期，销毁回调需自己负责。

```java
@Component
public class MyBean implements InitializingBean, DisposableBean {
    @PostConstruct
    public void init() { System.out.println("1. @PostConstruct 最先"); }
    @Override
    public void afterPropertiesSet() { System.out.println("2. InitializingBean 次之"); }
    @Override
    public void destroy() { System.out.println("DisposableBean 销毁回调"); }
}
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Spring IOC 与 AOP 的原理](/language/spring-ioc-aop)
- [线程池的核心参数与工作流程](/language/threadpool-params)
