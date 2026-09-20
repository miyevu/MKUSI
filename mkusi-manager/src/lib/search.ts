import { Product } from '@/context/ProductContext';

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = products
    .map(p => {
      const name = p.name.toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const category = p.category.toLowerCase();
      const description = (p.description || '').toLowerCase();

      let score = 0;

      // Exact name match — highest priority
      if (name === q) score += 100;
      // Name starts with the query
      else if (name.startsWith(q)) score += 50;
      // Name contains the full query as a substring
      else if (name.includes(q)) score += 30;

      // Per-term matching across all fields, so multi-word queries
      // like "blue case" match products where the words appear separately
      for (const term of terms) {
        if (name.includes(term)) score += 10;
        if (brand.includes(term)) score += 6;
        if (category.includes(term)) score += 5;
        if (description.includes(term)) score += 2;
      }

      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(({ product }) => product);
}