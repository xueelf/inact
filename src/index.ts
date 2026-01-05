import type { DangerouslySetInnerHTML } from '@/types';
import { camelToKebab, isVoidElement } from '@/util';

type Props = Record<string, unknown> & {
  dangerouslySetInnerHTML?: DangerouslySetInnerHTML;
};

type Type = string | ((props: Props) => string);

function serialize(children: unknown): string {
  switch (true) {
    case typeof children === 'number':
      return String(children);
    case !children:
    case typeof children === 'boolean':
      return '';
    case Array.isArray(children):
      return JSON.stringify(children);
    default:
      return String(children);
  }
}

function parseAttribute(name: string, value: unknown): string {
  // https://developer.mozilla.org/en-US/docs/Glossary/Attribute
  switch (true) {
    case typeof value === 'boolean':
      // https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML
      value = '';
      break;
    case name === 'style' && value && typeof value === 'object':
      value = Object.entries(value)
        .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
        .join('; ');
      break;
    case name === 'class' && Array.isArray(value):
      value = value.join(' ');
      break;
    case name === 'class' && value && typeof value === 'object':
      value = Object.entries(value)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(' ');
      break;
    default:
      value = String(value);
      break;
  }
  return `${name}="${value}"`;
}

function Fragment(props: Props): unknown {
  return Array.isArray(props.children)
    ? props.children.join('')
    : props.children;
}

function h(type: Type, props: Props): string {
  if (typeof type === 'function') {
    return type({ ...props });
  }
  const { children = '', dangerouslySetInnerHTML, ...attrProps } = props;
  const attributes: string = Object.entries(attrProps)
    .map(attribute => parseAttribute(...attribute))
    .join(' ');
  const is_void: boolean = isVoidElement(type);

  if (is_void) {
    return attributes ? `<${type} ${attributes} />` : `<${type} />`;
  }
  const openingTag: string = attributes
    ? `<${type} ${attributes}>`
    : `<${type}>`;
  const closingTag: string = `</${type}>`;
  const textContent: string =
    dangerouslySetInnerHTML?.__html ?? serialize(children);

  return `${openingTag}${textContent}${closingTag}`;
}

const jsx = h;
const jsxs = h;
const jsxDEV = h;

export { jsx, jsxs, jsxDEV, Fragment };
