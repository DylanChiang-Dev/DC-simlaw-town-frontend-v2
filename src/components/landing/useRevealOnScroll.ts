import { useEffect, useRef, type RefObject } from 'react';

const REVEALED_CLASS = 'is-revealed';

export function useRevealOnScroll<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion =
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add(REVEALED_CLASS);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEALED_CLASS);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
