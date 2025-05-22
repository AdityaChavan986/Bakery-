import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Search, Filter } from 'lucide-react';

type CategoryType = 'all' | 'bread' | 'pastry' | 'cake' | 'cookie' | 'muffin' | 'pie';

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories: { label: string; value: CategoryType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Bread', value: 'bread' },
    { label: 'Pastries', value: 'pastry' },
    { label: 'Cakes', value: 'cake' },
    { label: 'Cookies', value: 'cookie' },
    { label: 'Muffins', value: 'muffin' },
    { label: 'Pies', value: 'pie' },
  ];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Our Products"
        subtitle="Explore our wide range of fresh baked goods"
      />
      
      <div className="flex flex-col md:flex-row md:items-center mb-8 space-y-4 md:space-y-0">
        {/* Search */}
        <div className="flex-grow md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
            <Search size={20} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="md:ml-4 flex items-center">
          <Filter size={20} className="text-gray-500 mr-2 hidden md:block" />
          <span className="text-gray-500 mr-2 hidden md:block">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setActiveCategory('all');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;