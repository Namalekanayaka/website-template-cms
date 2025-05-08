'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon, X, History, Sparkles, Filter, ArrowRight } from 'lucide-react'

type SearchHistoryItem = {
  id: string
  query: string
  timestamp: Date
}

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const debouncedValue = useDebounce(value, 500)

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'articles', name: 'Articles' },
    { id: 'products', name: 'Products' },
    { id: 'news', name: 'News' },
  ]

  // Handle search routing
  useEffect(() => {
    if (!debouncedValue) return

    const category =
      selectedCategory && selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''

    router.push(`/search?q=${debouncedValue}${category}`)

    // Save to search history
    if (debouncedValue.trim() !== '') {
      const newHistoryItem = {
        id: Date.now().toString(),
        query: debouncedValue,
        timestamp: new Date(),
      }

      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.query !== debouncedValue)
        return [newHistoryItem, ...filtered].slice(0, 5)
      })
    }
  }, [debouncedValue, router, selectedCategory])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
        setShowHistory(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setValue('')
  }

  const handleSelectHistory = (query: string) => {
    setValue(query)
    setShowHistory(false)
  }

  const formatTime = (date: Date) => {
    const diffInHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="w-full max-w-xl mx-auto" ref={searchContainerRef}>
      <div
        className={`relative transition-all duration-300 ${
          isExpanded
            ? 'bg-white rounded-t-2xl shadow-xl'
            : 'bg-white/90 backdrop-blur-md rounded-full shadow-md hover:shadow-lg'
        }`}
      >
        <form
          className="flex items-center"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div
            className={`flex items-center justify-center w-12 text-gray-400 transition-colors ${
              isFocused ? 'text-blue-500' : ''
            }`}
          >
            <SearchIcon size={18} />
          </div>

          <Label htmlFor="search" className="sr-only">
            Search
          </Label>

          <Input
            id="search"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
            }}
            onFocus={() => {
              setIsFocused(true)
              setIsExpanded(true)
              if (searchHistory.length > 0) {
                setShowHistory(true)
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for articles, products, news..."
            className="flex-1 border-0 bg-transparent focus:ring-0 h-14 outline-none shadow-none px-0 text-lg"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center w-12 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className={`flex items-center justify-center h-10 px-5 mr-2 rounded-full transition-all ${
              value ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!value}
          >
            <span className="mr-1">Search</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Dropdown - using CSS transitions instead of framer-motion */}
        <div
          className={`absolute left-0 right-0 z-50 bg-white rounded-b-2xl shadow-xl overflow-hidden transition-all duration-300 origin-top ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Categories */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
            <Filter size={16} className="text-gray-400" />
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-1 text-sm whitespace-nowrap rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center justify-between px-2 mb-1">
                <div className="flex items-center text-sm text-gray-500">
                  <History size={14} className="mr-1" />
                  Recent searches
                </div>
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchHistory([])}
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-1">
                {searchHistory.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center justify-between w-full px-2 py-2 text-left rounded-lg hover:bg-gray-50"
                    onClick={() => handleSelectHistory(item.query)}
                  >
                    <div className="flex items-center">
                      <History size={14} className="mr-3 text-gray-400" />
                      <span>{item.query}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(item.timestamp)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {value && value.length > 1 && (
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center px-2 mb-1 text-sm text-gray-500">
                <Sparkles size={14} className="mr-1" />
                Suggestions
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto pb-2">
                {['blog post', 'article', 'tutorial'].map((type, i) => (
                  <button
                    key={i}
                    className="flex items-center w-full px-2 py-2 text-left rounded-lg hover:bg-gray-50"
                    onClick={() => setValue(`${value} ${type}`)}
                  >
                    <SearchIcon size={14} className="mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">{value}</span>
                      <span className="text-gray-500"> {type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {debouncedValue && !isExpanded && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-1 px-4">
          <SearchIcon size={12} />
          <span>Searching for: </span>
          <span className="font-medium">{debouncedValue}</span>
          {selectedCategory && selectedCategory !== 'all' && (
            <>
              <span>in</span>
              <span className="font-medium capitalize">{selectedCategory}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
