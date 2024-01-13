import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";

interface DebouncedInputProps {
    value: string
    onChange: (value: string | ReadonlyArray<string> | number | undefined) => void
    debounce?: number
}

const DebouncedInput = ({
                            value: initValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: DebouncedInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
    const [value, setValue] = useState(initValue);
    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    // *  0.5s after set value in state
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Input
            {...props}
            value={value}
            variant="ny"
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export default DebouncedInput;