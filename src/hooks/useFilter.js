import { useMemo, useState } from 'react';

// This hook reuses search and category filtering without changing source data.
export default function useFilter(items, { searchKeys = [], category: initialCategory = 'all', categoryKey = 'category' } = {}) {
  // These states hold the current text query and selected category.
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);

  // This memo returns items matching both the current query and category.
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === 'all' || item[categoryKey] === category;
      const matchesQuery = !normalizedQuery || searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [category, categoryKey, items, query, searchKeys]);

  return { filteredItems, filtered: filteredItems, query, setQuery, category, setCategory };
}
