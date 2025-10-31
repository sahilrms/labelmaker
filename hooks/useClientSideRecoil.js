import { useEffect, useState } from 'react';
import { RecoilState, useRecoilState } from 'recoil';

export function useClientSideRecoil(state, initialValue) {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useRecoilState(state);
  
  // Initialize with the provided value only on the client side
  const [initializedValue, setInitializedValue] = useState(initialValue);

  useEffect(() => {
    setIsMounted(true);
    
    // If we have an initial value and the state hasn't been set yet, initialize it
    if (initialValue !== undefined && value === undefined) {
      setValue(initialValue);
      setInitializedValue(initialValue);
    }
    
    return () => {
      setIsMounted(false);
    };
  }, [initialValue, setValue, value]);

  // Only return the initialized value on the server or during the initial render
  const safeValue = isMounted ? value : initializedValue;
  
  return [safeValue, setValue];
}
