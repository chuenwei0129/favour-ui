---
toc: menu
nav:
  title: Patterns
  path: /patterns
---

# 组件架构

## 草稿

- https://javascript.plainenglish.io/5-advanced-react-patterns-a6b7624267a6
- https://github.com/alexis-regnaud/advanced-react-patterns
- https://nostalgic-css.github.io/NES.css/
- https://www.zhihu.com/question/531555960
- https://zhuanlan.zhihu.com/p/536322574
- https://zhuanlan.zhihu.com/p/537385085
- https://zhuanlan.zhihu.com/p/539944257

关于组件分割：

1，页面里看上去像个组件的局部，就应该是个组件。看上去不像组件的局部，也未必不应该是组件，大部分时候，分割组件用力过猛，比分割不足强。

2，组件是树形分级的，不是一个局部封装成了组件，它内部就不需要再分组件了，要层层细分。

3，凡是“肚子”里内容有可能变化的区域，都应该抽取成与内容无关的容器组件，包括不限于弹框，卡片，下拉，message。

1，组件接口应该是尽量抽象的，而不应该过分具体。比如一个代表 logo 的 prop，就不宜假设 logo 一定是一个 http 开头的 url，因为实际使用完全有可能是一串 base64 字符串，或者一个 image 组件实例。

2，与上一条有点相关，组件 prop 应当具备重载性，比如凡是接收正则表达式的 prop，都应该同时允许接收一个 js 函数，从而支持高度定制。

3，如果你不确切知道什么时候用非受控组件，你应该永远封装受控组件，直到你非常清楚什么情况下受控组件不好用为止。

4，组件的 prop 应该具备统一的语义，比如 onClick 应该永远是我们熟知的那个意思，并且它接受的实参类型也应该符合直觉。

5，组件的 prop 应该具备统一范式，比如所有的回调类 prop 都应该有一个什么都不做的函数作为默认值。再比如如果一个组件的文案类 prop（比如 title）不支持多语言，那么所有组件的所有文案类 prop 都应该忽略多语言问题。

3，绝大部分组件，不管是组件库中的组件还是业务项目中的组件，都不该引用全局数据流。

4，请务必重视组件的渲染次数问题，你的组件的渲染次数可能比你以为的要多的多。什么情况下应该用非受控组件呀？比如 onchange 输出的状态数据很大，也不 immutable，一来一回比较费时，然而外部除了存储一下之外确实也没啥要中途改动的诉求。

## common

<code src="./common/usage/index.tsx" />

## compound

<code src="./compound/usage/index.tsx" />

## control props

<code src="./control-props/usage/index.tsx" />

## custom hooks

<code src="./custom-hooks/usage/index.tsx" />

## props getter

<code src="./props-getter/usage/index.tsx" />

## state reducer

<code src="./state-reducer/usage/index.tsx" />