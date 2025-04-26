import { Badge } from "@/components/ui/badge";
import { PaperMatch } from "@/hooks/useFilteredPapers";

interface PaperRelevanceProps {
  match: PaperMatch;
}

export function PaperRelevance({ match }: PaperRelevanceProps) {
  const { score, matches } = match;
  
  // Don't show anything if no matches
  if (score === 0) return null;
  
  const scoreColor = score >= 0.8 ? "bg-green-100" :
                    score >= 0.5 ? "bg-yellow-100" :
                    "bg-gray-100";
                    
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${scoreColor} text-xs`}
      >
        {Math.round(score * 100)}% Match
      </Badge>
      <div className="flex gap-1">
        {matches.category && (
          <Badge variant="secondary" className="text-xs">Category</Badge>
        )}
        {matches.author && (
          <Badge variant="secondary" className="text-xs">Author</Badge>
        )}
        {matches.keyword.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {matches.keyword.length} Keywords
          </Badge>
        )}
      </div>
    </div>
  );
}