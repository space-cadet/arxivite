import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from 'lucide-react';
import { advancedKeywordService } from '@/lib/keywords/t16/service';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdvancedKeywordsInputProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  className?: string;
}

const AdvancedKeywordsInput = ({ keywords, onAddKeyword, onRemoveKeyword, className = '' }: AdvancedKeywordsInputProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const getSuggestions = async () => {
      if (!inputValue.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const newSuggestions = await advancedKeywordService.getSuggestions(inputValue);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSelect = async (currentValue: string) => {
    if (!currentValue) return;

    const result = await advancedKeywordService.validateKeyword(currentValue);
    if (result.isValid && !keywords.includes(currentValue)) {
      onAddKeyword(currentValue);
    }
    
    setValue("");
    setInputValue("");
    setOpen(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {keywords.map(keyword => (
          <Badge 
            key={keyword}
            variant="secondary"
            className="flex items-center gap-2 py-1.5"
          >
            {keyword}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => onRemoveKeyword(keyword)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {keyword}</span>
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? suggestions.find((suggestion) => suggestion === value)
              : "Search research fields..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search research fields..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandEmpty>
              {isLoading ? (
                'Loading suggestions...'
              ) : inputValue.trim() ? (
                'No matching research fields found.'
              ) : (
                'Start typing to search research fields...'
              )}
            </CommandEmpty>
            {suggestions.length > 0 && (
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === suggestion ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {keywords.length === 0 && (
        <Alert>
          <AlertDescription>
            Add research keywords to help us find relevant papers for you. Start typing to search and select from available research fields.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdvancedKeywordsInput;