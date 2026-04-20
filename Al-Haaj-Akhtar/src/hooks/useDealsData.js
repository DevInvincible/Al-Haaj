import { useState, useEffect, useCallback } from 'react';

const DEALS_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1NB2677YNB2nauxQbEnKnw9Fq7506DszwBOAPNOYzvFY/gviz/tq?tqx=out:json&sheet=deals';
const ITEMS_PER_PAGE = 50;

// Restaurant hours - same as menu
const RESTAURANT_HOURS = {
  weekday: { open: 11, close: 1 }, // Mon-Fri: 11 AM - 1 AM (next day)
  weekend: { open: 11, close: 2 }, // Sat-Sun: 11 AM - 2 AM (next day)
};

// Check if restaurant is currently open
export const isRestaurantOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isWeekend = day === 0 || day === 6;
  const hours = isWeekend ? RESTAURANT_HOURS.weekend : RESTAURANT_HOURS.weekday;

  if (hour >= hours.open && hour < 24) return true;
  if (hour >= 0 && hour < hours.close) return true;

  return false;
};

// Get cache key for session storage
const getCacheKey = (category, branch) => `deals_${category}_${branch}`;

// Parse Google Sheets response
const parseDealsData = (data) => {
  try {
    let jsonStr = data;
    if (jsonStr.includes('google.visualization.Query.setResponse')) {
      const match = jsonStr.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
      if (match) jsonStr = match[1];
    }

    const parsed = JSON.parse(jsonStr);
    const table = parsed.table;
    const cols = table.cols.map(c => c.label || c.id);
    const rows = table.rows;

    if (rows.length === 0) return [];

    const colMap = {};
    cols.forEach((col, idx) => {
      colMap[col.toLowerCase().replace(/\s+/g, '_')] = idx;
    });

    const deals = rows.map((row, index) => {
      const cells = row.c || [];
      const getValue = (key) => {
        const idx = colMap[key.toLowerCase().replace(/\s+/g, '_')];
        return idx !== undefined ? (cells[idx]?.v || '') : '';
      };

      const dealName = getValue('deal_name') || getValue('dealname') || getValue('name');
      const itemsStr = getValue('items') || '';
      const totalItems = parseInt(getValue('total_items') || getValue('totalitems')) || 0;
      const rate = parseInt(getValue('rate') || getValue('price')) || 0;
      const category = getValue('category') || getValue('dish_type') || 'Deals';
      const timing = getValue('timing') || '';
      const branchAvailability = getValue('branch_availability') || getValue('branchavailability') || 'all';

      // Parse items list (comma or newline separated)
      const items = itemsStr.split(/[,\n]/).map(i => i.trim()).filter(Boolean);

      return {
        id: `deal_${index + 1}`,
        title: dealName,
        items: items,
        totalItems: totalItems || items.length,
        price: rate,
        originalPrice: Math.round(rate * 1.3), // 30% markup for original price
        category: category,
        timing: timing.toLowerCase(),
        branches: branchAvailability.split(',').map(b => b.trim().toLowerCase()).filter(Boolean) || ['all'],
        emoji: getDealEmoji(category),
        tag: getDealTag(items.length, rate),
        image: getDealImage(dealName, items, category),
      };
    }).filter(deal => deal.title && deal.price > 0);

    return deals;
  } catch (err) {
    return [];
  }
};

const getDealEmoji = (category) => {
  const emojiMap = {
    'lunch': '🍱',
    'dinner': '🍽️',
    'family': '👨‍👩‍👧‍👦',
    'combo': '🍛',
    'bbq': '🍢',
    'special': '⭐',
    'weekend': '🎉',
    'daily': '📅',
    'budget': '💰',
    'couple': '💑',
    'party': '🎊',
    'value': '💎',
  };

  const cat = (category || '').toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (cat.includes(key)) return emoji;
  }
  return '🎁';
};

// Map deal to food image - priority: deal name > category > items
const getDealImage = (dealName, items, category) => {
  const name = (dealName || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const itemsStr = (items || []).join(' ').toLowerCase();

  // Priority 1: Check deal NAME first (most specific)
  if (name.includes('bbq') || name.includes('grill') || name.includes('boti')) return '/food/kabab.jpg';
  if (name.includes('tikka')) return '/food/tikka.jpg';
  if (name.includes('karahi')) return '/food/Chicken_Karahi.jpg';
  if (name.includes('biryani')) return '/food/pulao.jpg';
  if (name.includes('pulao')) return '/food/pulao.jpg';
  if (name.includes('burger')) return '/food/burger.jpg';
  if (name.includes('pizza')) return '/food/pizza.jpg';
  if (name.includes('broast')) return '/food/broast.jpg';
  if (name.includes('qorma') || name.includes('korma')) return '/food/Qorma.jpg';
  if (name.includes('handi')) return '/food/handi.jpg';
  if (name.includes('raan')) return '/food/Raan.jpg';
  if (name.includes('mutton')) return '/food/Raan.jpg';
  if (name.includes('chinese') || name.includes('chopsuey') || name.includes('chow mein')) return '/food/chineese rice.jpg';
  if (name.includes('soup')) return '/food/soup.jpg';
  if (name.includes('salad')) return '/food/salad.jpg';
  if (name.includes('shawarma') || name.includes('wrap')) return '/food/roll.jpg';
  if (name.includes('roll') && !name.includes('raan')) return '/food/roll.jpg'; // exclude mutton raan
  if (name.includes('sandwich')) return '/food/sandwhich.jpg';
  if (name.includes('fish')) return '/food/fish_finger.jpg';
  if (name.includes('nuggets')) return '/food/nuggets.jpg';
  if (name.includes('wings')) return '/food/wings.jpg';
  if (name.includes('seafood') || name.includes('sea food')) return '/food/fish_finger.jpg';

  // Priority 2: Check CATEGORY
  if (cat.includes('bbq') || cat.includes('grill')) return '/food/kabab.jpg';
  if (cat.includes('karahi')) return '/food/Chicken_Karahi.jpg';
  if (cat.includes('biryani') || cat.includes('rice')) return '/food/pulao.jpg';
  if (cat.includes('burger')) return '/food/burger.jpg';
  if (cat.includes('pizza')) return '/food/pizza.jpg';
  if (cat.includes('broast') || cat.includes('fried chicken')) return '/food/broast.jpg';
  if (cat.includes('chinese')) return '/food/chineese rice.jpg';
  if (cat.includes('soup')) return '/food/soup.jpg';
  if (cat.includes('salad')) return '/food/salad.jpg';
  if (cat.includes('dessert') || cat.includes('sweet')) return '/food/kheer.jpg';
  if (cat.includes('beverage') || cat.includes('drink')) return '/food/beverages.jpg';
  if (cat.includes('naan') || cat.includes('bread')) return '/food/naan.jpg';
  if (cat.includes('wrap') || cat.includes('roll')) return '/food/roll.jpg';
  if (cat.includes('sandwich')) return '/food/sandwhich.jpg';
  if (cat.includes('fish') || cat.includes('seafood')) return '/food/fish_finger.jpg';
  if (cat.includes('daal') || cat.includes('dal')) return '/food/daal.jpg';
  if (cat.includes('sabzi') || cat.includes('vegetable')) return '/food/sabzi.jpg';
  if (cat.includes('qorma') || cat.includes('korma')) return '/food/Qorma.jpg';
  if (cat.includes('handi')) return '/food/handi.jpg';
  if (cat.includes('raan') || cat.includes('mutton') || cat.includes('goat')) return '/food/Raan.jpg';

  // Priority 3: Check ITEMS list
  if (itemsStr.includes('kabab') || itemsStr.includes('tikka') || itemsStr.includes('boti')) return '/food/kabab.jpg';
  if (itemsStr.includes('karahi')) return '/food/Chicken_Karahi.jpg';
  if (itemsStr.includes('biryani') || itemsStr.includes('pulao')) return '/food/pulao.jpg';
  if (itemsStr.includes('burger')) return '/food/burger.jpg';
  if (itemsStr.includes('pizza')) return '/food/pizza.jpg';
  if (itemsStr.includes('broast')) return '/food/broast.jpg';
  if (itemsStr.includes('qorma') || itemsStr.includes('korma')) return '/food/Qorma.jpg';
  if (itemsStr.includes('handi')) return '/food/handi.jpg';
  if (itemsStr.includes('raan')) return '/food/Raan.jpg';
  if (itemsStr.includes('fish')) return '/food/fish_finger.jpg';
  if (itemsStr.includes('chinese')) return '/food/chineese rice.jpg';
  if (itemsStr.includes('roll') || itemsStr.includes('wrap')) return '/food/roll.jpg';
  if (itemsStr.includes('sandwich')) return '/food/sandwhich.jpg';
  if (itemsStr.includes('naan')) return '/food/naan.jpg';
  if (itemsStr.includes('daal')) return '/food/daal.jpg';
  if (itemsStr.includes('sabzi')) return '/food/sabzi.jpg';
  if (itemsStr.includes('nuggets')) return '/food/nuggets.jpg';
  if (itemsStr.includes('wings')) return '/food/wings.jpg';
  if (itemsStr.includes('strips')) return '/food/chicken strips.jpg';
  if (itemsStr.includes('soup')) return '/food/soup.jpg';
  if (itemsStr.includes('salad')) return '/food/salad.jpg';
  if (itemsStr.includes('kheer') || itemsStr.includes('dessert')) return '/food/kheer.jpg';

  // Default fallbacks by deal type
  if (name.includes('family') || name.includes('combo') || name.includes('deal')) return '/food/platter.jpg';
  if (name.includes('lunch')) return '/food/platter.jpg';
  if (name.includes('dinner')) return '/food/Chicken_Karahi.jpg';

  return '/food/platter.jpg';
};

const getDealTag = (itemCount, price) => {
  if (price < 800) return 'Budget';
  if (price > 2000) return 'Family Pack';
  if (itemCount > 6) return 'Feast';
  if (itemCount > 4) return 'Value';
  return 'Popular';
};

// Fetch deals from Google Sheets
const fetchDealsData = async () => {
  try {
    const cacheKey = 'deals_all_data';
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
      return JSON.parse(cached);
    }

    const response = await fetch(DEALS_SHEETS_URL);
    if (!response.ok) throw new Error('Failed to fetch deals');

    const text = await response.text();
    const deals = parseDealsData(text);

    sessionStorage.setItem(cacheKey, JSON.stringify(deals));
    sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());

    return deals;
  } catch (err) {
    console.error('Error fetching deals:', err);
    return [];
  }
};

// Filter deals by category and branch
const filterDeals = (deals, category, branch) => {
  return deals.filter(deal => {
    const categoryMatch = category === 'All' ||
      deal.category?.toLowerCase() === category?.toLowerCase();

    const branchMatch = branch === 'all' ||
      deal.branches?.includes('all') ||
      deal.branches?.some(b => b.toLowerCase() === branch?.toLowerCase());

    return categoryMatch && branchMatch;
  });
};

// Custom hook for deals data with pagination (same pattern as useMenuData)
export const useDealsData = (selectedCategory = 'All', selectedBranch = 'all') => {
  const [allDeals, setAllDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [displayedDeals, setDisplayedDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Clear old cache to force fresh fetch
        sessionStorage.removeItem('deals_all_data');
        sessionStorage.removeItem('deals_all_data_time');

        // Check if we have cached data
        const cacheKey = 'deals_all_data_v2';
        const cached = sessionStorage.getItem(cacheKey);
        const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
          setAllDeals(JSON.parse(cached));
        } else {
          const response = await fetch(DEALS_SHEETS_URL);
          if (!response.ok) throw new Error(`Failed to fetch deals: ${response.status}`);

          const text = await response.text();
          const deals = parseDealsData(text);

          sessionStorage.setItem(cacheKey, JSON.stringify(deals));
          sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          setAllDeals(deals);
        }
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
    if (allDeals.length === 0) return;

    // Filter categories by branch - only show categories that exist at selected branch
    const branchDeals = allDeals.filter(deal => {
      return selectedBranch === 'all' ||
        deal.branches?.includes('all') ||
        deal.branches?.some(b => b.toLowerCase() === selectedBranch.toLowerCase());
    });
    const uniqueCategories = [...new Set(branchDeals.map(deal => deal.category).filter(Boolean))];
    setCategories(uniqueCategories);

    // Filter deals
    const filtered = filterDeals(allDeals, selectedCategory, selectedBranch);
    setFilteredDeals(filtered);

    // Reset to first page
    setCurrentPage(1);
    setDisplayedDeals(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);

    // Cache filtered results per category/branch
    const cacheKey = getCacheKey(selectedCategory, selectedBranch);
    sessionStorage.setItem(cacheKey, JSON.stringify({
      items: filtered,
      totalCount: filtered.length,
      cachedAt: Date.now()
    }));
  }, [allDeals, selectedCategory, selectedBranch]);

  // Load more items (pagination)
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredDeals.slice(0, endIndex);

    setDisplayedDeals(newItems);
    setCurrentPage(nextPage);
    setHasMore(filteredDeals.length > endIndex);
  }, [currentPage, filteredDeals, hasMore, loading]);

  return {
    deals: displayedDeals,
    allDeals,
    filteredDeals,
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    isRestaurantOpen: isRestaurantOpen(),
    refresh: async () => {
      sessionStorage.removeItem('deals_all_data_v2');
      sessionStorage.removeItem('deals_all_data_v2_time');
      const response = await fetch(DEALS_SHEETS_URL);
      const text = await response.text();
      const deals = parseDealsData(text);
      setAllDeals(deals);
    }
  };
};

export default useDealsData;
