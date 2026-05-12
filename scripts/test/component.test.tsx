import { expect, test } from 'bun:test';

test('component single', () => {
  function App() {
    return <div>App</div>;
  }

  expect(<App />).toBe('<div>App</div>');
});

test('component multiple', () => {
  function Child() {
    return <div>Child</div>;
  }

  function Parent() {
    return (
      <div>
        <Child />
      </div>
    );
  }

  expect(<Parent />).toBe('<div><div>Child</div></div>');
});

test('component children', () => {
  function Wrapper(props: { children?: unknown }) {
    return <section>{props.children}</section>;
  }

  expect(
    <Wrapper>
      <span>Child</span>
    </Wrapper>,
  ).toBe('<section><span>Child</span></section>');
});

test('component fragment', () => {
  function Items() {
    return (
      <>
        <span>Item</span>
        <span>Item</span>
      </>
    );
  }

  expect(<Items />).toBe('<span>Item</span><span>Item</span>');
});
