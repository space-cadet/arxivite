import { useProfile } from '@/contexts/ProfileContext';

export default function ProfileSummary() {
  const { profile } = useProfile();

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Your Research Profile</h3>
      
      {/* Categories */}
      {profile.categories.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {profile.categories.map(category => (
              <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {category}
              </span>
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
              <span key={author} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                {author}
              </span>
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
              <span key={keyword} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                {keyword}
              </span>
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