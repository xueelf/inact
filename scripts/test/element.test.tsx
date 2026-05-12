import { expect, test } from 'bun:test';

test('element for basic', () => {
  expect(<span>element for basic</span>).toBe('<span>element for basic</span>');
});

test('element for void', () => {
  expect(<input>element void</input>).toBe('<input />');
  expect(<input disabled value="element void" />).toBe(
    '<input disabled value="element void" />',
  );
  expect(<input disabled={false} value="element void" />).toBe(
    '<input value="element void" />',
  );
});
