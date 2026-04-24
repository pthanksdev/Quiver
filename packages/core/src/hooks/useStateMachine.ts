import { useState, useCallback, useRef } from 'react';

// ─── useStateMachine ─────────────────────────────────────────────────────────
export type Transitions<S extends string, E extends string> = Record<S, Partial<Record<E, S>>>;
export interface UseStateMachineReturn<S extends string, E extends string> {
  state: S;
  send: (event: E) => void;
  can: (event: E) => boolean;
}
/**
 * Finite state machine (FSM).
 * @param initial - Initial state
 * @param transitions - Nested map of state → event → nextState
 */
export function useStateMachine<S extends string, E extends string>(
  initial: S,
  transitions: Transitions<S, E>
): UseStateMachineReturn<S, E> {
  const [state, setState] = useState<S>(initial);
  const transitionsRef = useRef(transitions);
  transitionsRef.current = transitions;

  const send = useCallback((event: E) => {
    setState((current: S) => {
      const next = transitionsRef.current[current]?.[event];
      return next !== undefined ? next : current;
    });
  }, []);

  const can = useCallback((event: E) => transitionsRef.current[state]?.[event] !== undefined, [state]);
  return { state, send, can };
}
