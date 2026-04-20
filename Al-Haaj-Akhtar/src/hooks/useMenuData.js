import { useState, useEffect, useCallback } from 'react';

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1NB2677YNB2nauxQbEnKnw9Fq7506DszwBOAPNOYzvFY/gviz/tq?tqx=out:json';
const ITEMS_PER_PAGE = 50;

// Restaurant hours
const RESTAURANT_HOURS = {
  weekday: { open: 11, close: 1 }, // Mon-Fri: 11 AM - 1 AM (next day)
  weekend: { open: 11, close: 2 }, // Sat-Sun: 11 AM - 2 AM (next day)
};

// Check if restaurant is currently open
export const isRestaurantOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hour = now.getHours();
  
  const isWeekend = day === 0 || day === 6;
  const hours = isWeekend ? RESTAURANT_HOURS.weekend : RESTAURANT_HOURS.weekday;
  
  // Open at 11 AM
  if (hour >= hours.open && hour < 24) return true;
  // Close at 1 AM or 2 AM (next day)
  if (hour >= 0 && hour < hours.close) return true;
  
  return false;
};

// Check if item is available based on timing (Dinner items only after 5 PM)
export const isItemAvailableNow = (item) => {
  if (!isRestaurantOpen()) return false;
  
  const now = new Date();
  const hour = now.getHours();
  const timing = (item.timing || '').toLowerCase();
  
  // Lunch items available all day when restaurant is open
  if (timing.includes('lunch')) return true;
  
  // Dinner items only available after 5 PM
  if (timing.includes('dinner')) {
    return hour >= 17 || hour < 2; // 5 PM onwards or late night
  }
  
  // Default: available if restaurant is open
  return true;
};

// Parse Google Sheets response
const parseSheetsData = (data) => {
  try {
    // Google Sheets returns JSONP with callback like google.visualization.Query.setResponse({...})
    // Extract the JSON part between parentheses
    let jsonStr = data;
    
    // Remove callback wrapper
    const match = data.match(/^[^\(]*\((.*)\)[;\s]*$/s);
    if (match) {
      jsonStr = match[1];
    }
    
    const parsed = JSON.parse(jsonStr);
    
    // Check if we have the expected structure
    if (!parsed.table) {
      return [];
    }
    
    const rows = parsed.table.rows || [];
    const cols = parsed.table.cols || [];
    
    // Get column indices
    const colMap = {};
    cols.forEach((col, idx) => {
      colMap[col.label?.toLowerCase() || `col${idx}`] = idx;
    });
    
    return rows.map((row, index) => {
      const cells = row.c || [];
      const getValue = (key) => {
        const idx = colMap[key.toLowerCase()];
        return idx !== undefined ? (cells[idx]?.v || '') : '';
      };
      
      const timingValue = getValue('timing') || '';
      return {
        id: index + 1,
        name: getValue('item name') || getValue('name') || getValue('item'),
        price: parseInt(getValue('price')) || 0,
        category: getValue('dish type') || getValue('category') || 'Other',
        description: getValue('description') || '',
        emoji: getValue('emoji') || '🍽️',
        timing: timingValue, // Store timing for availability checking
        popular: timingValue.toLowerCase().includes('popular') || getValue('popular')?.toLowerCase() === 'yes',
        // Branch availability (comma-separated)
        branches: getValue('branch_availability')?.split(',').map(b => b.trim()).filter(Boolean) || ['all'],
        image: getValue('image') || '',
      };
    }).filter(item => item.name && item.price > 0);
  } catch (err) {
    return [];
  }
};

// Get cache key
const getCacheKey = (category, branch) => `menu_${category}_${branch}`;

// Fetch all menu data from Google Sheets
const fetchAllMenuData = async () => {
  try {
    // Check if we have cached data (v2 includes timing field)
    const cacheKey = 'menu_all_data_v2';
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
    
    // Use cache if less than 5 minutes old
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
      return JSON.parse(cached);
    }
    const response = await fetch(SHEETS_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const text = await response.text();
    const items = parseSheetsData(text);
    
    // Cache the data
    sessionStorage.setItem(cacheKey, JSON.stringify(items));
    sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    
    return items;
  } catch (err) {
    return [];
  }
};

// Filter items by category and branch
const filterItems = (items, category, branch) => {
    return items.filter(item => {
    const categoryMatch = category === 'All' || 
      item.category?.toLowerCase() === category?.toLowerCase();
    
    const branchMatch = branch === 'all' || 
      item.branches?.includes('all') ||
      item.branches?.some(b => b.toLowerCase() === branch?.toLowerCase());
    
    return categoryMatch && branchMatch;
  });
};

// Custom hook for menu data with pagination
export const useMenuData = (selectedCategory = 'All', selectedBranch = 'all') => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllMenuData();
        setAllItems(data);

        // Categories will be set by the filter effect below based on selectedBranch
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter when category or branch changes
  useEffect(() => {
    if (allItems.length === 0) return;

    // Filter categories by branch - only show categories that exist at selected branch
    const branchItems = allItems.filter(item => {
      return selectedBranch === 'all' ||
        item.branches?.includes('all') ||
        item.branches?.some(b => b.toLowerCase() === selectedBranch.toLowerCase());
    });
    const uniqueCategories = [...new Set(branchItems.map(item => item.category).filter(Boolean))];
    setCategories(uniqueCategories);

    const filtered = filterItems(allItems, selectedCategory, selectedBranch);
    setFilteredItems(filtered);

    // Reset to first page
    setCurrentPage(1);
    setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);

    // Cache filtered results
    const cacheKey = getCacheKey(selectedCategory, selectedBranch);
    sessionStorage.setItem(cacheKey, JSON.stringify({
      items: filtered,
      totalCount: filtered.length,
      cachedAt: Date.now()
    }));
  }, [allItems, selectedCategory, selectedBranch]);
  
  // Load more items (pagination)
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredItems.slice(0, endIndex);
    
    setDisplayedItems(newItems);
    setCurrentPage(nextPage);
    setHasMore(filteredItems.length > endIndex);
  }, [currentPage, filteredItems, hasMore, loading]);
  
  // Refresh data
  const refresh = useCallback(async () => {
    // Clear all cache
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('menu_')) sessionStorage.removeItem(key);
    });
    
    setLoading(true);
    try {
      const data = await fetchAllMenuData();
      setAllItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    items: displayedItems,
    allItems,
    filteredItems,
    categories,
    loading,
    error,
    hasMore,
    currentPage,
    totalPages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    totalCount: filteredItems.length,
    loadMore,
    refresh,
    isRestaurantOpen: isRestaurantOpen(),
  };
};

// Get categories from cached data
export const getAvailableCategories = () => {
  const cacheKey = 'menu_all_data_v2';
  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return [];
  
  try {
    const items = JSON.parse(cached);
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return categories.sort();
  } catch {
    return [];
  }
};

// Preload specific category/branch into cache
export const preloadCategory = async (category, branch = 'all') => {
  const cacheKey = getCacheKey(category, branch);
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  // If not cached, trigger a fetch (the hook will handle it)
  return null;
};

export default useMenuData;
