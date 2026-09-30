import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight, Star } from 'lucide-react';
import { Product } from '../../types/ecommerce';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = [
    'Wireless Headphones',
    'MacBook Air',
    'Running Shoes',
    'Smart Watch Series 9',
    'Organic Tulsi Tea',
  ];

  const popularCategories = [
    'Electronics',
    'Audio',
    'Mobiles',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Care',
    'Sports & Fitness',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const matchedCategories = query.trim()
    ? popularCategories.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands and more..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {/* If user is typing and has matching items */}
          {query.trim() ? (
            <div>
              {matchedCategories.length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          onClose();
                        }}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        In {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                Products ({filteredProducts.length})
              </span>

              {filteredProducts.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer group transition-colors"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {product.brand} • {product.category}
                        </p>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            {product.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-amber-500 gap-0.5 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      onSearchSubmit(query.trim());
                      onClose();
                    }}
                    className="w-full mt-3 py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View all matching results for "{query}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No products found for "{query}"</p>
                  <p className="text-xs mt-1">Try checking for spelling or search general categories like "audio", "mobiles", or "shoes".</p>
                </div>
              )}
            </div>
          ) : (
            // Default Suggestions (Recent & Popular)
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trending Categories</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {popularCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onSelectCategory(category);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all cursor-pointer group"
                    >
                      <span>{category}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
