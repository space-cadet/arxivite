import * as React from "react"
import { Input } from "./input"
import { useInputHistory } from "@/hooks/useInputHistory"
import { HistoryDropdown } from "./history-dropdown"

interface HistoryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  maxHistory?: number;
  onValueChange?: (value: string) => void;
}

const HistoryInput = React.forwardRef<HTMLInputElement, HistoryInputProps>(
  ({ id, maxHistory, onValueChange, onChange, onKeyDown, ...props }, ref) => {
    const {
      value,
      setValue,
      addToHistory,
      history
    } = useInputHistory({ id, maxHistory });

    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge the forwarded ref with our internal ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onValueChange?.(e.target.value);
      onChange?.(e);
    };

    const handleSelect = (selectedValue: string) => {
      setValue(selectedValue);
      onValueChange?.(selectedValue);
      
      // Create a synthetic event that looks like a real input event
      const syntheticEvent = {
        target: { value: selectedValue },
        currentTarget: { value: selectedValue }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      
      // Focus the input after selection
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value) {
        addToHistory(value);
        setIsOpen(false);
      } else if (e.key === 'ArrowDown' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      if (history.length > 0) {
        setIsOpen(true);
      }
    };

    return (
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          {...props}
        />
        <HistoryDropdown 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          history={history}
          onSelect={handleSelect}
          anchorRef={inputRef}
        />
      </div>
    );
  }
);

HistoryInput.displayName = "HistoryInput";

export { HistoryInput };