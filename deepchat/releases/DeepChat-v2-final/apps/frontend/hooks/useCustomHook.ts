import { useState, useEffect } from 'react';

// A sample custom hook
export const useCustomHook = (initialValue: any) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        // Some side effect logic here
    }, [value]);

    return [value, setValue];
}; 