import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';

const Header = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Sample data - replace with actual data from your context/API
  const sampleRecipes = [
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish',
      category: 'Italian',
      tags: ['pasta', 'italian', 'quick'],
      cookingTime: 20,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Chicken Tikka Masala',
      description: 'Creamy Indian curry',
      category: 'Indian',
      tags: ['chicken', 'curry', 'spicy'],
      cookingTime: 45,
      difficulty: 'Medium'
    },
    {
      id: '3',
      title: 'French Onion Soup',
      description: 'Classic French soup with caramelized onions',
      category: 'French',
      tags: ['soup', 'french', 'comfort'],
      cookingTime: 60,
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'Beef Tacos',
      description: 'Mexican street-style tacos',
      category: 'Mexican',
      tags: ['beef', 'mexican', 'street-food'],
      cookingTime: 30,
      difficulty: 'Easy'
    }
  ];

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = sampleRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.category.toLowerCase().includes(query.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(filtered);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Navigate to search results page with query
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowSearchResults(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleResultClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
    setShowSearchResults(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close search results when clicking outside
  const handleSearchBlur = () => {
    // Delay to allow click on search results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  return (
    <header className="text-white shadow-md sticky top-0 z-50"
    style={{background: 'linear-gradient(to right,rgb(107, 52, 23)'}}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">
              <img src="/src/assets/HomeChef_Logo.png" alt="logo" width={100} />
            </span>
            HomeChef
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex relative mx-4 flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder={t('search.placeholder') || 'Search recipes, ingredients, cuisines...'}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-10 py-2 rounded-full border-none focus:ring-2 focus:ring-orange-300 bg-white/90 text-gray-800 placeholder-gray-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
              size={18} 
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            )}
          </form>

          {/* Desktop Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      Found {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  </div>
                  {searchResults.map((recipe) => (
                    <div
                      key={recipe.id}
                      onClick={() => handleResultClick(recipe.id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                            <span>{recipe.category}</span>
                            <span>{recipe.cookingTime} min</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                              {recipe.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 border-t border-gray-100">
                    <button
                      onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
                      className="w-full text-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </>
              ) : searchQuery.trim() ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No recipes found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try different keywords or browse our categories</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {user && (
            <div className="hidden md:block">
              <span className="text-sm font-medium">
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search - only visible when menu is open */}
       
    </header>
  );
};
export default Header;