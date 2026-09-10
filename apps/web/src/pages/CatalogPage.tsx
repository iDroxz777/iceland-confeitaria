import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { categories, products } from '../data/products';
import type { Product } from '../types';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function CatalogPage({ onSelectProduct }: { onSelectProduct: (product: Product) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return products.filter((product) => {
      const inCategory = category === 'Todos' || product.category === category;
      const haystack = normalize(`${product.name} ${product.description} ${product.fillings?.join(' ') ?? ''}`);
      return inCategory && (!term || haystack.includes(term));
    });
  }, [category, query]);

  return (
    <main className="catalog-page">
      <header className="page-intro">
        <span className="eyebrow">Cardápio completo</span>
        <h1>Bolos, tortas, doces e salgados com a receita de sempre</h1>
        <p>Todo o cardápio publicado hoje em confeitariaiceland.com.br, reunido aqui. Busque por nome, filtre por categoria ou deixe que a gente ajude você a decidir na aba Fazer Pedido.</p>
        <strong className="catalog-tally">37 bolos · 4 tortas · 5 bolos caseiros · 7 docinhos e sobremesas · 5 consumo na unidade — 58 produtos no total.</strong>
      </header>

      <section className="catalog-tools" aria-label="Filtros do cardápio">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Buscar no cardápio</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar (ex: brigadeiro, limão, croissant...)" />
          {query && <button onClick={() => setQuery('')} aria-label="Limpar busca"><X size={17} /></button>}
        </label>
        <div className="category-list" role="group" aria-label="Filtrar por categoria">
          {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </section>

      <section className="catalog-results" aria-live="polite">
        <p className="result-count">{filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
        {filtered.length > 0 ? (
          <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />)}</div>
        ) : (
          <div className="empty-state"><h2>Nenhum produto encontrado</h2><p>Tente buscar outro ingrediente ou limpar os filtros.</p><button className="primary-button" onClick={() => { setQuery(''); setCategory('Todos'); }}>Limpar filtros</button></div>
        )}
      </section>
    </main>
  );
}
