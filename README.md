# inact

Inact is a transformation library that can directly output JSX as HTML strings.

Read this in other languages: English | [中文](https://github.com/xueelf/inact/blob/master/README.zh.md)

```tsx
const Paragraph = <p>hello world</p>;
console.log(<Paragraph />); // -> '<p>hello world</p>'
```

## Introduction

What can this project be used for?

As we all know, without using **third-party libraries or frameworks**, most developers would choose template literals to write page elements.

For example, here's the simplest code snippet:

```javascript
const content = 'hello world';
const app = document.getElementById('app');

app.innerHTML = `
  <p>${content}</p>
`;
```

Besides that, we can also use functions to create page elements:

```javascript
const text = 'hello world';
const app = document.getElementById('app');
const element = document.createElement('p');
const content = document.createTextNode(text);

element.appendChild(content);
app.insertBefore(element, null);
```

But compared to the former, this is way too complicated. If there are many page elements involved, the code also becomes unreadable. Therefore, people tend to prefer template literals.

However, when using template literals to write HTML, the IDE won't provide tag highlighting or autocompletion, and there won't be any error prompts if you make a mistake. And when it comes to for-loop iteration in templates... if you've ever written ASP, JSP, or PHP, you know how painful this can be. ~~(IDEA: Bet you didn't expect—I actually do have tag highlighting and autocompletion for template literals.)~~

So... is it possible that we could use JSX to solve this?

```tsx
function Paragraph(props: { content: string }): string {
  return <p>{props.content}</p>;
}
```

Although nowadays there are excellent projects like [React](https://react.dev/) and [Preact](https://preactjs.com/), they are too "heavy". If we just want to write some simple page structures, probably not many people would make their project depend on a third‑party ecosystem just to use JSX.

Not everyone needs a virtual DOM, and not everyone wants to write `app` and `render` in their **small projects**.

So, what does Inact do?

```tsx
const content = 'hello world';
const app = document.getElementById('app');

app.innerHTML = <p>{content}</p>;
```

~~Wow, amazing, only JSX can do!~~

( •̀ ω •́ )✧ No complex processing, just purely output native HTML strings. The rest of the logic is entirely in your hands.

## Installation

I recommend using Inact together with [TypeScript](https://www.typescriptlang.org/). You can install the required dependencies using npm or any other package manager.

```shell
npm install -D typescript inact
```

Of course, if you don't use TypeScript for development, you can also integrate tools like [ESBuild](https://esbuild.github.io/) or [Rollup](https://rollupjs.org/). In essence, Inact is a `jsx‑runtime` and can be freely combined with other tools.

## Usage

Taking TypeScript as an example, after installing the relevant dependencies, we first need to run `tsc --init` in the project root and then modify the generated `tsconfig.json` file:

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
  return <p>{props.content}</p>;
}

const text: string = 'hello world';
const app: HTMLElement = document.getElementById('app')!;

app.innerHTML = <Paragraph content={text} />;
```

## Features

#### `class`

Supports arrays and objects:

```tsx
<div class={['foo', 'bar']} />
<div class={{ foo: true, bar: false }} />
```

#### `style`

Supports camel‑case objects:

```tsx
<div style={{ backgroundColor: 'red' }} />
```

### Fragment

You can use `<>...</>` or `<Fragment>...</Fragment>` to group elements, so you don't need to add extra wrapper nodes in the HTML, improving code readability and maintainability.

### dangerouslySetInnerHTML

If you need to render raw HTML text:

```tsx
<div dangerouslySetInnerHTML={{ __html: '<span>Raw HTML</span>' }} />
```

## About

Initially, I needed to develop a plugin for [Docsify](https://docsify.js.org/) (a documentation framework that converts Markdown to HTML and renders it), so I used template literals to handle page elements—as most docsify plugins do.

But over time, I increasingly felt the code becoming hard to maintain and read, so I started using [vhtml](https://github.com/developit/vhtml) to refactor the plugin. That project was once recommended by Preact as a solution for pure HTML string output.

However, vhtml didn't fully meet my needs. For example, I wanted to pass arrays or objects to class, which it didn't support. Moreover, vhtml only provides the `h` function, if you want to use it with TypeScript, you need extra configuration, define JSX types yourself, and write a `Fragment` function, it's not out‑of‑the‑box.

More importantly, in the source code of vhtml, the `arguments` keyword is used, which is not recommended and behaves inconsistently in strict mode. For example, I now prefer using bun for development, and I encountered various weird issues. It's not suitable for integration into modern code.

Of course, this isn't entirely vhtml's fault. It's a great open‑source project, just not what I needed. After almost searching the entire web and still not finding a similar solution, I built this project.
