// User preference keys
const SEARCH_HISTORY_KEY = 'maskani-search-history';
const VIEWED_PROPERTIES_KEY = 'maskani-viewed-properties';
const UNIVERSITY_PREFERENCE_KEY = 'maskani-university-preference';
const PRICE_RANGE_KEY = 'maskani-price-range';

// Maximum number of items to store in history
const MAX_HISTORY_ITEMS = 20;

// Get search history from localStorage
export const getSearchHistory = (): string[] => {
  try {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error('Failed to parse search history', error);
    return [];
  }
};

// Add search location to history
export const addSearchToHistory = (location: string): void => {
  if (!location) return;
  
  try {
    const history = getSearchHistory();
    
    // Remove duplicate if exists
    const filteredHistory = history.filter(item => item !== location);
    
    // Add new location at the beginning
    const newHistory = [location, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to add search to history', error);
  }
};

// Get viewed properties from localStorage
export const getViewedProperties = (): string[] => {
  try {
    const viewedProperties = localStorage.getItem(VIEWED_PROPERTIES_KEY);
    return viewedProperties ? JSON.parse(viewedProperties) : [];
  } catch (error) {
    console.error('Failed to parse viewed properties', error);
    return [];
  }
};

// Add property ID to viewed properties
export const addPropertyToViewed = (propertyId: string): void => {
  if (!propertyId) return;
  
  try {
    const viewedProperties = getViewedProperties();
    
    // Remove duplicate if exists
    const filteredProperties = viewedProperties.filter(id => id !== propertyId);
    
    // Add new property at the beginning
    const newViewedProperties = [propertyId, ...filteredProperties].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(VIEWED_PROPERTIES_KEY, JSON.stringify(newViewedProperties));
  } catch (error) {
    console.error('Failed to add property to viewed', error);
  }
};

// Save university preference
export const saveUniversityPreference = (university: string): void => {
  if (!university) return;
  localStorage.setItem(UNIVERSITY_PREFERENCE_KEY, university);
};

// Get university preference
export const getUniversityPreference = (): string => {
  return localStorage.getItem(UNIVERSITY_PREFERENCE_KEY) || '';
};

// Save price range preference
export const savePriceRangePreference = (min: number, max: number): void => {
  localStorage.setItem(PRICE_RANGE_KEY, JSON.stringify({ min, max }));
};

// Get price range preference
export const getPriceRangePreference = (): { min: number, max: number } | null => {
  try {
    const priceRange = localStorage.getItem(PRICE_RANGE_KEY);
    return priceRange ? JSON.parse(priceRange) : null;
  } catch (error) {
    console.error('Failed to parse price range preference', error);
    return null;
  }
};

// Clear all user preferences (for testing or logout)
export const clearAllPreferences = (): void => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  localStorage.removeItem(VIEWED_PROPERTIES_KEY);
  localStorage.removeItem(UNIVERSITY_PREFERENCE_KEY);
  localStorage.removeItem(PRICE_RANGE_KEY);
}; 