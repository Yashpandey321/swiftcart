import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Star, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Zap, 
  SlidersHorizontal,
  X,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { ProductCard } from './ProductCard';
import { POPULAR_CATEGORIES } from '../../data/ecommerceData';

interface ProductListingProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlistIds: Set<string>;
  searchQuery?: string;
  onClearSearch?: () => void;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'discount';

export const ProductListing: React.FC<ProductListingProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  searchQuery = '',
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyFastDelivery, setOnlyFastDelivery] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available brands in the current collection
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (selectedCategory === 'All' || p.category === selectedCategory) {
        brandsSet.add(p.brand);
      }
    });
    return Array.from(brandsSet).sort();
  }, [products, selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        // Price filter
        if (product.price > priceRange) {
          return false;
        }

        // Rating filter
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }

        // In Stock filter
        if (onlyInStock && !product.inStock) {
          return false;
        }

        // Fast delivery filter
        if (onlyFastDelivery && !product.deliveryEstimate.toLowerCase().includes('today') && !product.deliveryEstimate.toLowerCase().includes('tomorrow')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
            return b.discountPercent - a.discountPercent;
          default:
            return 0; // relevance
        }
      });
  }, [
    products,
    selectedCategory,
    selectedBrands,
    priceRange,
    minRating,
    onlyInStock,
    onlyFastDelivery,
    sortBy,
    searchQuery,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(150000);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyFastDelivery(false);
  };

  const activeFiltersCount = 
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyFastDelivery ? 1 : 0) +
    (priceRange < 150000 ? 1 : 0);

  const filterSidebarContent = (
    <div className="space-y-5">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-sm text-slate-900 dark:text-white">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center bg-blue-600">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.name && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      {availableBrands.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
            Brand
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 px-1 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => setMinRating(minRating === stars ? 0 : stars)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                minRating === stars
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{stars}★ & above</span>
              </div>
              {minRating === stars && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
        <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <span className="flex items-center gap-1.5 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>Fast Delivery (24 hrs)</span>
          </span>
          <input
            type="checkbox"
            checked={onlyFastDelivery}
            onChange={(e) => setOnlyFastDelivery(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <span className="font-semibold">In Stock Only</span>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
        </label>
      </div>

    </div>
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen pb-16 sm:pb-20">
      
      {/* 1. FLIPKART & AMAZON MOBILE COMPACT FILTER / SORT BAR */}
      <div className="sticky top-28 sm:top-32 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`lg:hidden px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                activeFiltersCount > 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* Quick Fast Delivery chip */}
            <button
              onClick={() => setOnlyFastDelivery(!onlyFastDelivery)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition cursor-pointer ${
                onlyFastDelivery
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>SwiftAssured</span>
            </button>

            {/* In stock chip */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`hidden xs:flex px-2.5 py-1.5 rounded-xl text-xs font-bold items-center gap-1 border transition cursor-pointer ${
                onlyInStock
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>In Stock</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-2.5 pr-7 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs focus:ring-2 focus:ring-blue-500 outline-hidden cursor-pointer"
              >
                <option value="relevance">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Discount %</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. RESULTS CONTAINER */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-4">
        
        {/* Results summary line */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <p>
            Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> items for{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">"{selectedCategory}"</span>
          </p>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          )}
        </div>

        {/* Desktop Sidebar + Mobile 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs self-start sticky top-36">
            {filterSidebarContent}
          </aside>

          {/* Right Product Grid (2-Column on Mobile, 3 on Tablet, 4 on Desktop) */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.has(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-10 h-10 mx-auto text-blue-500 mb-2.5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Try clearing some filters or loosening your price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Slide-over Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Filters</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterSidebarContent}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer bg-blue-600 hover:bg-blue-700 transition"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
