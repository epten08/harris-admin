import { useState, useCallback } from 'react';

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

interface AuthFormState {
  [key: string]: FormField;
}

interface ValidationRules {
  [key: string]: (value: string) => string;
}

export const useAuthForm = (initialState: { [key: string]: string }, validationRules: ValidationRules) => {
  const [formState, setFormState] = useState<AuthFormState>(() => {
    const state: AuthFormState = {};
    Object.keys(initialState).forEach(key => {
      state[key] = {
        value: initialState[key],
        error: '',
        touched: false
      };
    });
    return state;
  });

  const setValue = useCallback((field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        error: prev[field].touched ? validationRules[field]?.(value) || '' : ''
      }
    }));
  }, [validationRules]);

  const setTouched = useCallback((field: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched: true,
        error: validationRules[field]?.(prev[field].value) || ''
      }
    }));
  }, [validationRules]);

  const validateAll = useCallback(() => {
    const newState = { ...formState };
    let isValid = true;

    Object.keys(newState).forEach(key => {
      newState[key].touched = true;
      newState[key].error = validationRules[key]?.(newState[key].value) || '';
      if (newState[key].error) {
        isValid = false;
      }
    });

    setFormState(newState);
    return isValid;
  }, [formState, validationRules]);

  const reset = useCallback(() => {
    const newState: AuthFormState = {};
    Object.keys(initialState).forEach(key => {
      newState[key] = {
        value: initialState[key],
        error: '',
        touched: false
      };
    });
    setFormState(newState);
  }, [initialState]);

  const getValues = useCallback(() => {
    const values: { [key: string]: string } = {};
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  const hasErrors = Object.values(formState).some(field => field.error !== '');
  const isValid = Object.values(formState).every(field => field.error === '' && field.value !== '');

  return {
    formState,
    setValue,
    setTouched,
    validateAll,
    reset,
    getValues,
    hasErrors,
    isValid
  };
};