import { type DangerouslySetInnerHTML } from '@/types';
import { camelToKebab, isVoidElement } from '@/util';

type Props = Record<string, unknown> & {
  dangerouslySetInnerHTML?: DangerouslySetInnerHTML;
};

type Type = string | ((props: Props) => unknown);

function getInvalidChildMessage(child: unknown): string {
  if (child && typeof child === 'object') {
    const keys = Object.keys(child);

    return keys.length
      ? `Objects are not valid as an JSX child (found: object with keys {${keys.join(', ')}}).`
      : 'Objects are not valid as an JSX child.';
  }
  return `${typeof child} is not valid as an JSX child.`;
}

function serialize(children: unknown): string {
  switch (typeof children) {
    case 'undefined':
    case 'boolean':
      return '';
    case 'string':
    case 'number':
      return String(children);
    case 'object':
      if (children === null) {
        return '';
      }
      if (Array.isArray(children)) {
        return children.map(child => serialize(child)).join('');
      }
      throw new TypeError(getInvalidChildMessage(children));
    default:
      throw new TypeError(getInvalidChildMessage(children));
  }
}

function parseAttribute(name: string, value: unknown): string | undefined {
  // https://developer.mozilla.org/en-US/docs/Glossary/Attribute
  if (value === null || value === undefined || value === false) {
    return undefined;
  }
  if (value === true) {
    // https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML
    return name;
  }
  let attrValue: string;

  switch (true) {
    case name === 'style' && typeof value === 'object':
      attrValue = Object.entries(value)
        .filter(([, cssValue]) => cssValue !== null && cssValue !== undefined)
        .map(([key, cssValue]) => `${camelToKebab(key)}: ${cssValue}`)
        .join('; ');
      break;
    case name === 'class' && Array.isArray(value):
      attrValue = value.join(' ');
      break;
    case name === 'class' && typeof value === 'object':
      attrValue = Object.entries(value)
        .filter(([, enabled]) => enabled)
        .map(([className]) => className)
        .join(' ');
      break;
    default:
      attrValue = String(value);
      break;
  }
  return `${name}="${attrValue}"`;
}

function Fragment(props: Props): string {
  return serialize(props.children);
}

function h(type: Type, props: Props): string {
  if (typeof type === 'function') {
    return serialize(type({ ...props }));
  }
  const { children = '', dangerouslySetInnerHTML, ...attrProps } = props;
  const attributes: string = Object.entries(attrProps)
    .map(attribute => parseAttribute(...attribute))
    .filter(attribute => attribute !== undefined)
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

export { Fragment, jsx, jsxDEV, jsxs };
