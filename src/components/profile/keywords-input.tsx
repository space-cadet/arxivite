import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryInput } from "@/components/ui/history-input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeywordsInputProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  className?: string;
}

const KeywordsInput = ({ keywords, onAddKeyword, onRemoveKeyword, className = '' }: KeywordsInputProps) => {
  const [newKeyword, setNewKeyword] = React.useState('');
  const { toast } = useToast();

  const handleAddKeyword = () => {
    const keyword = newKeyword.trim();
    if (keyword.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid keyword",
        description: "Please enter a valid research keyword"
      });
      return;
    }
    
    if (keywords.includes(keyword)) {
      toast({
        variant: "destructive",
        title: "Duplicate keyword",
        description: "This keyword is already in your profile"
      });
      return;
    }
    
    onAddKeyword(keyword);
    setNewKeyword('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:flex-1">
          <HistoryInput
            id="research-keyword"
            placeholder="Add a research keyword"
            value={newKeyword}
            onValueChange={setNewKeyword}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAddKeyword();
              }
            }}
          />
        </div>
        <Button 
          variant="default"
          onClick={handleAddKeyword}
          disabled={!newKeyword.trim()}
          className="flex-1 sm:flex-none"
        >
          Add Keyword
        </Button>
      </div>

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

      {keywords.length === 0 && (
        <Alert>
          <AlertDescription>
            Add research keywords to help us find relevant papers for you.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default KeywordsInput;