# inact

Inact is a transformation library that can directly output JSX as its HTML string.

Read this in other languages: English | [简体中文](https://github.com/xueelf/inact/blob/master/README.zh.md)

```jsx
console.log(<div>hello world</div>); // -> '<div>hello world</div>'
```

## Introduction

What can this project be used for?

As we all know, without using **third party libraries or frameworks**, most developers would choose to use template strings to write page elements.

For example, the following code is a simple example:

```javascript
const message = 'hello world';
const app = document.getElementById('app');

app.innerHTML = `
  <div>${message}</div>
`;
```

In addition, we can also use functions to create page elements:

```javascript
const message = 'hello world';
const app = document.getElementById('app');
const element = document.createElement('div');
const content = document.createTextNode(message);

element.appendChild(content);
app.insertBefore(element, null);
```

However, compared to the former, it is too complicated. If there are many page elements involved, the code will also become less readable. Therefore, people tend to prefer using template strings.

So... is there a possibility that we can use JSX?

```jsx
function MyComponent() {
  const message = 'hello world';
  return <div>{message}</div>;
}
```

Although nowadays, there are excellent projects like [React](https://react.dev/) and [Preact](https://preactjs.com/), they are too "heavy". If we just want to simply write some page structures, not many people would rely on the ecosystem of third party libraries just to use JSX.

Not everyone has a use case for virtual DOM, and not everyone wants to write `app` and `render` in their **small projects**.

So, what does Inact do?

```jsx
const message = 'hello world';
const app = document.getElementById('app');

app.innerHTML = <div>{message}</div>;
```

~~Wow, amazing, only JSX can do!~~

( •̀ ω •́ )✧ No complicated processing, purely outputting native HTML strings, and the rest of the logic is entirely up to you to handle.

## Installation

I recommend using Inact directly with [TypeScript](https://www.typescriptlang.org/). You can use npm or other package managers to install the relevant dependencies.

```shell
npm install -D typescript inact
```

Of course, if you don't want to use TypeScript for development, you can also integrate tools like [ESBuild](https://esbuild.github.io/) or [Rollup](https://rollupjs.org/). Inact is essentially a `jsx-runtime` and can be freely used in combination with these tools.

## Usage

Taking TypeScript as an example, after installing the relevant dependencies, we need to execute the `tsc --init` command in the project root directory and modify the corresponding `tsconfig.json` file content:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "inact"
  }
}
```

Is that it? Yes, after modifying `jsx` and `jsxImportSource`, you can directly use TSX to write your page code.

```tsx
function Paragraph(props: { content: string }): string {
  return <div>{props.content}</div>;
}

const message: string = 'hello world';
const app: HTMLElement = document.getElementById('app')!;

app.innerHTML = <Paragraph content={message} />;
```

## About

Initially, I developed this because I needed to create a plugin for [Docsify](https://docsify.js.org/) (this is a documentation framework that converts Markdown into HTML and renders it on the page). At that time, I used template strings to handle page elements, as most docsify plugins do.

However, as time went on, I felt that the code was becoming increasingly difficult to maintain and read, so I started using [vhtml](https://github.com/developit/vhtml) to refactor the plugin, this project is also the solution by Preact once recommended for pure HTML string output.

But vhtml didn't fully meet my needs. For example, I wanted to pass arrays or objects to the class, which it didn't support. Additionally, vhtml only provides the h function. If you want to use it with TypeScript, you need extra configuration, define JSX types yourself, and write a `Fragment` function, which is not out-of-the-box.

More importantly, in the source code of vhtml, the `arguments` keyword is used, which is not recommended and behaves inconsistently in strict mode. For example, I now prefer using bun for development, and I encountered various weird issues. It is not suitable for integration into modern code.

Of course, this is not entirely vhtml's fault. It is an excellent open source project, but it just didn't meet my needs. After almost searching the entire internet and not finding a similar solution, I developed this project.
