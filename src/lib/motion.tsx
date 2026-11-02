import { createElement, type ComponentType, type HTMLAttributes, type ReactNode } from 'react';

type MotionProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  whileInView?: unknown;
  whileHover?: unknown;
  transition?: unknown;
  viewport?: unknown;
  layout?: unknown;
};

function createMotionElement(tag: keyof HTMLElementTagNameMap): ComponentType<MotionProps> {
  return function MotionElement({
    initial: _initial,
    animate: _animate,
    exit: _exit,
    whileInView: _whileInView,
    whileHover: _whileHover,
    transition: _transition,
    viewport: _viewport,
    layout: _layout,
    ...props
  }: MotionProps) {
    return createElement(tag, props);
  };
}

const motionCache = new Map<string, ComponentType<MotionProps>>();

export const motion = new Proxy({} as Record<string, ComponentType<MotionProps>>, {
  get(_target, tag: string) {
    if (!motionCache.has(tag)) {
      motionCache.set(tag, createMotionElement(tag as keyof HTMLElementTagNameMap));
    }
    return motionCache.get(tag);
  },
});

export function AnimatePresence({ children }: { children?: ReactNode; mode?: string }) {
  return children;
}
