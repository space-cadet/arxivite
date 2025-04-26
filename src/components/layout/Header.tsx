import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <h2 className="text-lg font-semibold mr-6">ArXivite</h2>
          <Link 
            to="/search" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Search
          </Link>
          <Link 
            to="/profile" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Profile
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;