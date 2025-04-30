import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface HistoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
  onSelect: (value: string) => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export function HistoryDropdown({
  isOpen,
  onClose,
  history,
  onSelect,
  anchorRef,
}: HistoryDropdownProps) {
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  React.useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < history.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < history.length) {
          onSelect(history[highlightedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, history, highlightedIndex, onSelect, onClose]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!history.length) return null;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <div ref={anchorRef as React.RefObject<HTMLDivElement>} />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandEmpty>No history found.</CommandEmpty>
          <CommandGroup>
            {history.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  onSelect(item);
                  onClose();
                }}
                className={highlightedIndex === index ? "bg-accent" : ""}
              >
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}