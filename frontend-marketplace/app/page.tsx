'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product, Category, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const NO_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23b0afa8'>Sin imagen</text></svg>";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    const url = selectedCategory
      ? `${API_URL}/products?categoryId=${selectedCategory}`
      : `${API_URL}/products`;

    fetch(url, { cache: 'no-store' } as RequestInit)
      .then(r => r.json())
      .then((data: ApiResponse<Product[]>) => setProducts(data.success ? data.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [selectedCategory]);

  const delayClass = (i: number) => {
    const delays = ['fade-up', 'fade-up fade-up-delay-1', 'fade-up fade-up-delay-2', 'fade-up fade-up-delay-3', 'fade-up fade-up-delay-4'];
    return delays[i % delays.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">Catálogo</h1>
          <p className="text-sm text-[#9b9a96] mt-0.5">
            {loadingProducts ? 'Cargando...' : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            disabled={loadingCategories}
            className="text-sm border border-[#e5e5e4] rounded-lg px-3 py-2 bg-white text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs text-[#9b9a96] hover:text-[#1a1a1a] transition-colors border border-[#e5e5e4] rounded-lg px-3 py-2 bg-white"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#eeeeed] mb-8" />

      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#eeeeed] rounded-2xl overflow-hidden animate-pulse">
              <div className="w-full h-44 bg-[#f3f3f1]" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-[#f3f3f1] rounded w-3/4" />
                <div className="h-4 bg-[#f3f3f1] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 fade-up">
          <p className="text-[#9b9a96] text-sm">No hay productos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`bg-white border border-[#eeeeed] rounded-2xl overflow-hidden card-lift ${delayClass(i)}`}
            >
              {/* Image */}
              <div className="img-zoom w-full h-44 bg-[#f9f9f8]">
                <img
                  src={product.imageUrl || NO_IMG}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h2 className="text-sm font-semibold text-[#1a1a1a] leading-snug line-clamp-1">
                    {product.nombre}
                  </h2>
                  {product.category && (
                    <span className="shrink-0 text-[10px] font-medium text-[#9b9a96] bg-[#f3f3f1] px-2 py-0.5 rounded-full">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {product.descripcion && (
                  <p className="text-xs text-[#9b9a96] line-clamp-2 mb-3 leading-relaxed">
                    {product.descripcion}
                  </p>
                )}

                <p className="text-base font-semibold text-[#1a1a1a]">
                  S/ {product.precio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
