# inact

Inact 是一个可以将 JSX 直接输出为其 HTML 字符串的转换库。

使用其他语言阅读：[English](https://github.com/xueelf/inact/blob/master/README.md) | 简体中文

```jsx
console.log(<div>hello world</div>); // -> '<div>hello world</div>'
```

## 介绍

这个项目可以用来做什么？

众所周知，在不使用**第三方库或框架**的前提下，大部分开发人员，都会选择使用模板字符串来编写页面元素。

例如下列代码，这是一个最简单的示例：

```javascript
const message = 'hello world';
const app = document.getElementById('app');

app.innerHTML = `
  <div>${message}</div>
`;
```

除此之外，我们也可以使用函数来创建页面元素：

```javascript
const message = 'hello world';
const app = document.getElementById('app');
const element = document.createElement('div');
const content = document.createTextNode(message);

element.appendChild(content);
app.insertBefore(element, null);
```

但相较于前者，它太过于复杂了，如果涉及的页面元素较多，代码也会变得没有可读性。因此，人们更加倾向于使用模板字符串。

那...有没有一种可能，我们可以使用 JSX？

```jsx
function MyComponent() {
  const message = 'hello world';
  return <div>{message}</div>;
}
```

尽管现如今，出现了像 [React](https://react.dev/) 和 [Preact](https://preactjs.com/) 之类的优秀项目，但它们都太「重」了。如果我们只是想简单地去编写一些页面结构，那可能没有多少人，仅仅是为了使用 JSX 就将项目依赖于第三方库的生态体系。

不是所有人都有虚拟 DOM 的需求场景，也不是所有人都想在自己的**小型项目**中编写 `app` 与 `render`。

那么，Inact 是怎么做的？

```jsx
const message = 'hello world';
const app = document.getElementById('app');

app.innerHTML = <div>{message}</div>;
```

~~Wow, amazing, only JSX can do!~~

( •̀ ω •́ )✧ 不做任何复杂的处理，纯粹地输出 HTML 原生字符串，剩下的逻辑，全都由你亲手处理。

## 安装

我推荐将 Inact 直接搭配 [TypeScript](https://www.typescriptlang.org/) 来使用，你可以使用 npm，或者其它包管理器安装相关依赖。

```shell
npm install -D typescript inact
```

当然，如果你不想使用 TypeScript 开发，也可以集成 [ESBuild](https://esbuild.github.io/) 或 [Rollup](https://rollupjs.org/) 等工具，Inact 本质上是一个 `jsx-runtime`，可以自由搭配使用。

## 使用

以 TypeScript 为例，当安装好相关依赖后，我们需要在项目根目录执行 `tsc --init` 命令，并修改对应的 `tsconfig.json` 文件内容：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "inact"
  }
}
```

这就完了？没错，修改 `jsx` 与 `jsxImportSource` 后，你便可以直接使用 TSX 来编写你的页面代码了。

```tsx
function Paragraph(props: { content: string }): string {
  return <div>{props.content}</div>;
}

const message: string = 'hello world';
const app: HTMLElement = document.getElementById('app')!;

app.innerHTML = <Paragraph content={message} />;
```

## 关于

最初，我是因为要在 [Docsify](https://docsify.js.org/) 中开发插件（这是一个可以将 Markdown 转换为 HTML 并渲染至页面的文档框架），便使用了模板字符串来处理页面元素，docsify 的大部分插件也都是这么做的。

但随着时间的推移，我愈发觉得代码会逐渐变得不易维护和不可读，所以开始使用 [vhtml](https://github.com/developit/vhtml) 来重构插件，该项目也是 Preact 曾经推荐用于纯 HTML 字符串输出的解决方案。

但是 vhtml 并没有完全解决我的使用需求，例如，我要为 class 传入数组亦或是对象，它并没有为其提供支持。其次是 vhtml 仅仅提供了 `h` 函数，如果想在 TypeScript 中使用，还需要额外的配置并自行定义 JSX 类型和编写 `Fragment` 函数，不能做到开箱即用。

更重要的是，在 vhtml 的源码中，使用到了 `arguments` 这个不被推荐、在严格模式中表现不一致的关键字。例如我现在习惯使用 bun 开发项目，就遇到了各种诡异的问题，它并不适合集成到现代代码中。

当然，这并不全是 vhtml 的问题，它是一个十分优秀的开源项目，只是不满足我的使用需求。在几乎搜遍全网，也没有找到类似的解决方案后，我便开发了这个项目。
