import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => clearTimeout(timerRef.current), []);

  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [cancel, delayMs],
  );

  return { debounced, cancel };
}
