import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const navItems: Array<{ label: string; view?: AppView; anchor?: string }> = [
  { label: 'Início', view: 'inicio' },
  { label: 'Cardápio', view: 'cardapio' },
  { label: 'Fazer pedido', view: 'pedido' },
  { label: 'Sobre', anchor: 'tradition-home' },
  { label: 'Contato', anchor: 'footer-contact' },
];

export function Header({ currentView, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const navigate = (view: AppView) => {
    onNavigate(view);
    setOpen(false);
  };

  const activate = (item: (typeof navItems)[number]) => {
    setOpen(false);
    if (item.view) return navigate(item.view);
    if (currentView !== 'inicio') onNavigate('inicio');
    window.setTimeout(() => document.getElementById(item.anchor ?? '')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('inicio')} aria-label="Ir para o início">
        <img src="https://confeitariaiceland.com.br/wp-content/uploads/2020/06/logo-ice-1.jpg" alt="Confeitaria Iceland" />
      </button>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={item.view && currentView === item.view ? 'active' : ''}
            onClick={() => activate(item)}
            aria-current={item.view && currentView === item.view ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="order-button desktop-order" onClick={() => navigate('pedido')}>
        Fazer pedido
      </button>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação móvel">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => activate(item)}>{item.label}</button>
          ))}
        </nav>
      )}
    </header>
  );
}
