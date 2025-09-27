'use client';

import { Contestant } from '@/types';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ContestantFilterProps {
  contestants: Contestant[];
  onFilter: (filteredContestants: Contestant[]) => void;
}

export default function ContestantFilter({ contestants, onFilter }: ContestantFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'company'>('rank');
  const [filterByNationality, setFilterByNationality] = useState<string>('all');

  const nationalities = Array.from(new Set(contestants.map(c => c.nationality).filter(Boolean)));

  const applyFilters = (search: string, sort: string, nationality: string) => {
    let filtered = [...contestants];

    if (search) {
      filtered = filtered.filter(contestant =>
        contestant.name.toLowerCase().includes(search.toLowerCase()) ||
        (contestant.company && contestant.company.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (nationality !== 'all') {
      filtered = filtered.filter(contestant => contestant.nationality === nationality);
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case 'rank':
          return (a.rank || 999) - (b.rank || 999);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    });

    onFilter(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, sortBy, filterByNationality);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'rank' | 'name' | 'company');
    applyFilters(searchTerm, value, filterByNationality);
  };

  const handleNationalityChange = (value: string) => {
    setFilterByNationality(value);
    applyFilters(searchTerm, sortBy, value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('rank');
    setFilterByNationality('all');
    onFilter(contestants);
  };

  const getNationalityFlag = (nationality: string): string => {
    const flagMap: Record<string, string> = {
      'KR': '🇰🇷',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'TW': '🇹🇼',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'VN': '🇻🇳'
    };
    return flagMap[nationality] || '🌟';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        🔍 参加者検索・フィルター
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            検索
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="名前や事務所で検索..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            並び順
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="rank">順位順</option>
            <option value="name">名前順</option>
            <option value="company">事務所順</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            国籍
          </label>
          <select
            value={filterByNationality}
            onChange={(e) => handleNationalityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">すべて</option>
            {nationalities.map(nationality => (
              <option key={nationality} value={nationality}>
                {getNationalityFlag(nationality!)} {nationality}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(searchTerm || sortBy !== 'rank' || filterByNationality !== 'all') && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            フィルター適用中
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            リセット
          </button>
        </div>
      )}
    </motion.div>
  );
}