import { useProfile } from '@/contexts/ProfileContext';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { getCategoryName } from '@/lib/categories';

export default function ProfileSummary() {
  const { profile, removeFromProfile } = useProfile();

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Your Research Profile</h3>
      
      {/* Categories */}
      {profile.categories.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {profile.categories.map(category => (
              <Badge 
                key={category}
                className="flex items-center gap-1"
              >
                {getCategoryName(category)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFromProfile('categories', category)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Authors */}
      {profile.authors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Authors</h4>
          <div className="flex flex-wrap gap-2">
            {profile.authors.map(author => (
              <Badge 
                key={author}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {author}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFromProfile('authors', author)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {profile.keywords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {profile.keywords.map(keyword => (
              <Badge 
                key={keyword}
                variant="outline"
                className="flex items-center gap-1"
              >
                {keyword}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFromProfile('keywords', keyword)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {profile.categories.length === 0 && profile.authors.length === 0 && profile.keywords.length === 0 && (
        <p className="text-gray-500 text-sm">No profile preferences set. Visit the profile page to customize your research interests.</p>
      )}
    </div>
  );
}