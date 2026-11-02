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
  type?: string;
  onAnimationComplete?: () => void;
};

const MOTION_KEYS = new Set([
  'initial', 'animate', 'exit', 'whileInView', 'whileHover', 'transition',
  'viewport', 'layout', 'onAnimationComplete',
]);

function createMotionElement(tag: keyof HTMLElementTagNameMap): ComponentType<MotionProps> {
  return function MotionElement(props: MotionProps) {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !MOTION_KEYS.has(key)),
    );
    return createElement(tag, domProps);
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
