export type AttrClass = string | string[] | Record<string, boolean>;

export type AttrStyle = string | Partial<CSSStyleDeclaration>;

export interface DangerouslySetInnerHTML {
  __html: string;
}

export type TagProps<T extends HTMLElement> = Partial<
  Omit<T, 'children' | 'class' | 'style'>
> & {
  children?: unknown;
  class?: AttrClass;
  style?: AttrStyle;
  dangerouslySetInnerHTML?: DangerouslySetInnerHTML;
};

declare global {
  namespace JSX {
    type Element = string;

    interface ElementChildrenAttribute {
      children: unknown;
    }

    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: TagProps<HTMLElementTagNameMap[K]>;
    };
  }
}
