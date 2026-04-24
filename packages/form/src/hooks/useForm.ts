import { useState, useCallback } from 'react';

// ─── Validation engine ────────────────────────────────────────────────────────
type Validator<T> = (value: T) => string | null;

// ─── useForm ─────────────────────────────────────────────────────────────────
export interface UseFormOptions<T> {
  initialValues: T;
  validators?: Partial<Record<keyof T, Validator<T[keyof T]>>>;
  onSubmit: (values: T) => Promise<void> | void;
}
export interface UseFormReturn<T> {
  values: T; errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>; dirty: boolean;
  submitting: boolean; submitError: Error | null;
  setValue: (key: keyof T, value: T[keyof T]) => void;
  setTouched: (key: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}
/**
 * Complete form state with validation, submission, dirty tracking, and error handling.
 */
export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>): UseFormReturn<T> {
  const { initialValues, validators = {}, onSubmit } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const validate = useCallback((vals: T): Partial<Record<keyof T, string>> => {
    const errs: Partial<Record<keyof T, string>> = {};
    for (const [key, validator] of Object.entries(validators)) {
      const err = (validator as Validator<unknown>)(vals[key as keyof T]);
      if (err) errs[key as keyof T] = err;
    }
    return errs;
  }, [validators]);

  const setValue = useCallback((key: keyof T, value: T[keyof T]) => {
    setValues(prev => { const next = { ...prev, [key]: value }; setErrors(validate(next)); return next; });
  }, [validate]);

  const setTouched = useCallback((key: keyof T) => setTouchedState(prev => ({ ...prev, [key]: true })), []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouchedState(Object.fromEntries(Object.keys(values).map(k => [k, true])) as Partial<Record<keyof T, boolean>>);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true); setSubmitError(null);
    try { await onSubmit(values); }
    catch (err) { setSubmitError(err as Error); }
    finally { setSubmitting(false); }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => { setValues(initialValues); setErrors({}); setTouchedState({}); }, [initialValues]);
  return { values, errors, touched, dirty, submitting, submitError, setValue, setTouched, handleSubmit, reset };
}
