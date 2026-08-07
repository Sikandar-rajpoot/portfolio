import { useEffect, useState } from 'react';

export function useInViewport(
  elementRef,
  unobserveOnIntersect,
  options = {},
  shouldObserve = true
) {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);
  const { root, rootMargin, threshold } = options;

  useEffect(() => {
    if (!elementRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      const { isIntersecting, target } = entry;

      setIntersect(isIntersecting);

      if (isIntersecting && unobserveOnIntersect) {
        observer.unobserve(target);
        setIsUnobserved(true);
      }
    }, { root, rootMargin, threshold });

    if (!isUnobserved && shouldObserve) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [elementRef, unobserveOnIntersect, root, rootMargin, threshold, isUnobserved, shouldObserve]);

  return intersect;
}
