import { useState, useEffect } from 'react';

// Define a generic type for the hook
function useSafeLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  // Use the generic type T for the state
  const [value, setValue] = useState<T>(initialValue);

  // Load from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored) as T);
        } else {
          setValue(initialValue);
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        setValue(initialValue);
      }
    }
  }, [key, initialValue]);

  // Update localStorage when value changes
  const updateValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove the key from localStorage
  const remove = () => {
    try {
      setValue(initialValue);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [value, updateValue, remove];
}

export default useSafeLocalStorage;