import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tags?.[0] && <span className="product-tag">{product.tags[0]}</span>}
      </div>
      <div className="product-copy">
        <span className="eyebrow">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>{product.priceCents ? `${formatCurrency(product.priceCents)} / ${product.unit}` : 'Sob consulta'}</strong>
          <button onClick={() => onSelect(product)} aria-label={`Escolher ${product.name}`}>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
