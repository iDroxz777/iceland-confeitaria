import { useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ProductDialog } from './components/ProductDialog';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { OrderPage } from './pages/OrderPage';
import type { AppView, Product } from './types';

export function App() {
  const [view, setView] = useState<AppView>('inicio');
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const navigate = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectProduct = (product: Product) => setDialogProduct(product);
  const orderProductNow = (product: Product) => {
    setDialogProduct(null);
    setOrderProduct(product);
    navigate('pedido');
  };

  return (
    <div className="app-shell">
      <Header currentView={view} onNavigate={navigate} />
      {view === 'inicio' && <HomePage onNavigate={navigate} onSelectProduct={selectProduct} />}
      {view === 'cardapio' && <CatalogPage onSelectProduct={selectProduct} />}
      {view === 'pedido' && <OrderPage initialProduct={orderProduct} />}
      <Footer onNavigate={navigate} />
      <ProductDialog product={dialogProduct} onClose={() => setDialogProduct(null)} onOrder={orderProductNow} />
    </div>
  );
}
