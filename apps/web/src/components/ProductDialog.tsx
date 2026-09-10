import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import type { Product } from '../types';

interface ProductDialogProps {
  product: Product | null;
  onClose: () => void;
  onOrder: (product: Product) => void;
}

export function ProductDialog({ product, onClose, onOrder }: ProductDialogProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button ref={closeButton} className="dialog-close" onClick={onClose} aria-label="Fechar detalhes"><X /></button>
        <img src={product.image} alt={product.name} />
        <div className="dialog-copy">
          <span className="eyebrow">{product.category}</span>
          <h2 id="product-dialog-title">{product.name}</h2>
          <p>{product.description}</p>
          {product.fillings && product.fillings.length > 0 && <p className="filling"><strong>Recheio:</strong> {product.fillings.join(', ')}</p>}
          <div className="dialog-actions">
            <strong>{product.priceCents ? `${formatCurrency(product.priceCents)} / ${product.unit}` : 'Preço sob consulta'}</strong>
            <button className="primary-button" onClick={() => onOrder(product)}>Escolher este produto</button>
          </div>
        </div>
      </section>
    </div>
  );
}
