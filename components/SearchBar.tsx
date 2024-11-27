"use client"

import * as React from "react"
import { useState, useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Search, Loader2, X } from 'lucide-react'
import { cn } from "@/lib/utils"

const fetchStockSuggestions = async (query: string) => {
  try {
    const response = await fetch(`/api/stock/search?q=${query}`);
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
      return data.results.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching stock suggestions:', error);
    return [];
  }
}

interface SearchBarProps {
  onStockSelect?: (symbol: string) => void;
}

interface StockSuggestion {
  symbol: string;
  name: string;
}

export function SearchBar({ onStockSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedFetchSuggestions = useDebouncedCallback(
    async (value: string) => {
      if (value) {
        setIsLoading(true)
        const newSuggestions = await fetchStockSuggestions(value)
        setSuggestions(newSuggestions.slice(0, 5))
        setIsLoading(false)
        console.log(newSuggestions);
      } else {
        setSuggestions([])
      }
    },
    300 //300ms debounce time to avoid too many requests
  )

  useEffect(() => {
    debouncedFetchSuggestions(query)
  }, [query, debouncedFetchSuggestions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value) {
      setIsExpanded(true)
    }
  }

  const handleSelectSuggestion = (suggestion: { symbol: string, name: string }) => {
    setQuery('')
    setIsExpanded(false)
    onStockSelect?.(suggestion.symbol)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto" ref={inputRef}>
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "relative bg-background border rounded-md shadow-sm",
          isExpanded 
            ? "rounded-b-none border-b-0 shadow-none transition-none" 
            : "transition-all duration-300"
        )}
      >
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
          className="w-full pr-10 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-none"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          onClick={() => {
            if (isExpanded) {
              setQuery('')
              setIsExpanded(false)
            }
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isExpanded ? "Clear search" : "Search"}
          </span>
        </Button>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-background border border-t-0 rounded-b-md shadow-sm -mt-px"
          >
            <Command className="border-none">
              <CommandList className="max-h-full overflow-hidden">
                {suggestions.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup heading="Suggestions">
                    {(() => {
                      const items = [];
                      for (let i = 0; i < suggestions.length; i++) {
                        const suggestion = suggestions[i];
                        items.push(
                          <CommandItem
                            key={suggestion.symbol}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            className="flex justify-between"
                          >
                            <span className="font-medium">{suggestion.symbol}</span>
                            <span className="text-muted-foreground">{suggestion.name}</span>
                          </CommandItem>
                        );
                      }
                      return items;
                    })()}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

