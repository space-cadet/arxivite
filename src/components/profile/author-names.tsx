import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryInput } from "@/components/ui/history-input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthorNamesProps {
  authorNames: string[];
  onAddName: (name: string) => void;
  onRemoveName: (name: string) => void;
  className?: string;
}

const AuthorNames = ({ authorNames, onAddName, onRemoveName, className = '' }: AuthorNamesProps) => {
  const [newName, setNewName] = React.useState('');
  const { toast } = useToast();

  const handleAddName = () => {
    const name = newName.trim();
    if (name.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Please enter your full name as it appears on arXiv papers"
      });
      return;
    }
    
    // Check if this name variant already exists
    if (authorNames.includes(name)) {
      toast({
        variant: "destructive",
        title: "Duplicate name",
        description: "This name variant is already in your profile"
      });
      return;
    }
    
    onAddName(name);
    setNewName('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:flex-1">
          <HistoryInput
            id="author-name-variant"
            placeholder="Add another variant of your name (e.g. Rachel L. Maitra)"
            value={newName}
            onValueChange={setNewName}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAddName();
              }
            }}
          />
        </div>
        <Button 
          variant="default"
          onClick={handleAddName}
          disabled={!newName.trim()}
          className="flex-1 sm:flex-none"
        >
          Add Name
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {authorNames.map(name => (
          <Badge 
            key={name}
            variant="secondary"
            className="flex items-center gap-2 py-1.5"
          >
            {name}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => onRemoveName(name)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {name}</span>
            </Button>
          </Badge>
        ))}
      </div>

      {authorNames.length === 0 && (
        <Alert>
          <AlertDescription>
            Add different variants of your name as they appear on your arXiv papers 
            (e.g. "Rachel Maitra", "Rachel L. Maitra", "Rachel Lash Maitra")
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AuthorNames;