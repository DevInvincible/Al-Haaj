import { useState, useEffect, useCallback, useRef, memo } from 'react';

// Karachi areas data - pre-loaded common locations
const KARACHI_AREAS = [
  'Gulshan-e-Iqbal',
  'Gulistan-e-Johar',
  'Clifton',
  'Defence (DHA)',
  'Korangi',
  'Landhi',
  'Malir',
  'North Karachi',
  'North Nazimabad',
  'Buffer Zone',
  'Federal B Area',
  'Gulberg',
  'Liaquatabad',
  'Nazimabad',
  'New Karachi',
  'Orangi Town',
  'SITE Area',
  'Saddar',
  'PECHS',
  'Tariq Road',
  'Bahadurabad',
  'Gulshan-e-Maymar',
  'Scheme 33',
  'University Road',
  'Rashid Minhas Road',
  'Shahrah-e-Faisal',
  'Shahrah-e-Quaideen',
  'M.A. Jinnah Road',
  'I.I. Chundrigar Road',
  'Karsaz',
  'Dalmia',
  'Shah Faisal Colony',
  'Jamshed Town',
  'Liaquat Colony',
  'Soldier Bazaar',
  'Garden East',
  'Garden West',
  'Kharadar',
  'Mithadar',
  'Lyari',
  'Sher Shah',
  'Gulshan-e-Hadeed',
  'Steel Town',
  'Port Qasim',
  'Bin Qasim Town',
  'Malir Cantonment',
  'Faisal Cantonment',
  'Karachi Cantonment',
  'Manora',
  'Keamari',
  'Sikanderabad',
  'Baldia Town',
  'Ittehad Town',
  'Mango Pir',
  'Surjani Town',
  'Yousuf Goth',
];

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Location search hook
export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const abortControllerRef = useRef(null);

  // Search function
  const searchLocations = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // 1. Filter local Karachi areas first
      const localMatches = KARACHI_AREAS.filter(area =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);

      // 2. Fetch from OpenStreetMap Nominatim API for Karachi
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm + ', Karachi, Pakistan')}&limit=5&countrycodes=pk`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      
      // Format API results
      const apiResults = data
        .filter(item => item.display_name.toLowerCase().includes('karachi'))
        .map(item => ({
          name: item.display_name.split(',')[0],
          fullAddress: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: item.type,
          source: 'api'
        }));

      // Combine local and API results, remove duplicates
      const combined = [
        ...localMatches.map(name => ({ name, fullAddress: name + ', Karachi, Pakistan', source: 'local' })),
        ...apiResults.filter(api => 
          !localMatches.some(local => 
            api.name.toLowerCase().includes(local.toLowerCase())
          )
        )
      ].slice(0, 8);

      setSuggestions(combined);
      setIsOpen(combined.length > 0);
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Fallback to local search only
        const localMatches = KARACHI_AREAS.filter(area =>
          area.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 8);
        
        setSuggestions(localMatches.map(name => ({ 
          name, 
          fullAddress: name + ', Karachi, Pakistan',
          source: 'local'
        })));
        setIsOpen(localMatches.length > 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    searchLocations(debouncedQuery);
  }, [debouncedQuery, searchLocations]);

  const selectLocation = useCallback((location) => {
    setSelectedLocation(location);
    setQuery(location.name);
    setIsOpen(false);
    setSuggestions([]);
  }, []);

  const clearLocation = useCallback(() => {
    setQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    selectedLocation,
    isOpen,
    setIsOpen,
    selectLocation,
    clearLocation,
  };
}

// Location Search Component
function LocationSearch({ onSelect, placeholder = 'Search location in Karachi...' }) {
  const {
    query,
    setQuery,
    suggestions,
    loading,
    isOpen,
    setIsOpen,
    selectLocation,
    clearLocation,
  } = useLocationSearch();

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleSelect = (location) => {
    selectLocation(location);
    if (onSelect) {
      onSelect(location);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 40px 14px 16px',
            border: '1px solid #e8dfc8',
            borderRadius: '8px',
            fontSize: '15px',
            background: '#fff',
            color: '#1a1208',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {query && (
          <button
            onClick={clearLocation}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#999',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        )}
        {loading && !query && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              border: '2px solid #e8dfc8',
              borderTopColor: '#D4AF37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e8dfc8',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelect(location)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#faf8f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1208' }}>
                    {location.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8a7a60', marginTop: '2px' }}>
                    {location.fullAddress}
                  </div>
                </div>
                {location.source === 'local' && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '10px',
                      padding: '2px 8px',
                      background: '#D4AF37',
                      color: '#080604',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    Popular
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e8dfc8',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            color: '#8a7a60',
            fontSize: '14px',
          }}
        >
          No locations found. Try a different search term.
        </div>
      )}
    </div>
  );
}

// Add spin animation to global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default memo(LocationSearch);
