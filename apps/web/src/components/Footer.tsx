import { Camera, Clock3, MapPin, Phone } from 'lucide-react';
import type { AppView } from '../types';

export function Footer({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <footer className="site-footer" id="footer-contact">
      <div className="footer-brand">
        <img src="https://confeitariaiceland.com.br/wp-content/uploads/2020/06/logo-ice-1.jpg" alt="Confeitaria Iceland" />
        <p>Confeitaria artesanal com mais de 30 anos em Ribeirão Preto. Bolos feitos para os momentos que ficam.</p>
      </div>
      <div>
        <h2>Visite a Iceland</h2>
        <a href="https://www.google.com/maps/dir/?api=1&destination=Av.%20Nove%20de%20Julho%2C%201614%2C%20Ribeir%C3%A3o%20Preto%20-%20SP" target="_blank" rel="noreferrer"><MapPin size={17} /> Av. Nove de Julho, 1614</a>
        <span><Clock3 size={17} /> Seg–sex, 9h30–18h · Sáb, 9h30–17h</span>
      </div>
      <div>
        <h2>Fale com a equipe</h2>
        <a href="tel:+551636107700"><Phone size={17} /> (16) 3610-7700</a>
        <a href="tel:+551638472739"><Phone size={17} /> (16) 3847-2739</a>
        <a href="https://www.instagram.com/confeitariaiceland/" target="_blank" rel="noreferrer"><Camera size={17} /> Instagram</a>
        <a href="https://www.facebook.com/confeitariaiceland/" target="_blank" rel="noreferrer">Facebook</a>
      </div>
      <div className="footer-nav">
        <h2>Navegação</h2>
        <button onClick={() => onNavigate('inicio')}>Início</button>
        <button onClick={() => onNavigate('cardapio')}>Cardápio</button>
        <button onClick={() => onNavigate('pedido')}>Fazer pedido</button>
      </div>
      <a className="footer-map" href="https://www.google.com/maps/dir/?api=1&destination=Av.%20Nove%20de%20Julho%2C%201614%2C%20Ribeir%C3%A3o%20Preto%20-%20SP" target="_blank" rel="noreferrer">
        <span><MapPin size={18} /> Ver localização da Iceland no Google Maps</span>
      </a>
      <p className="footer-legal">© {new Date().getFullYear()} Confeitaria Iceland. Delivery em Ribeirão Preto e Bonfim Paulista. Dados de contato, horário e cardápio conforme confeitariaiceland.com.br (set/2026) — confirmar com a equipe antes de publicar.</p>
    </footer>
  );
}
