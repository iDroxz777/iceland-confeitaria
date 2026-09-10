import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import type { AppView, Product } from '../types';

interface HomePageProps {
  onNavigate: (view: AppView) => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  const categoryImages = [
    ['Bolos', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/06/BoloMousseMorango4.jpg'],
    ['Tortas', 'https://confeitariaiceland.com.br/wp-content/uploads/2023/11/TortaCheeseCakeMorango-1024x1024.jpg'],
    ['Bolos Caseiros', 'https://confeitariaiceland.com.br/wp-content/uploads/2023/11/CaseiroMarmore2-300x300.jpg'],
    ['Docinhos e Sobremesas', 'https://confeitariaiceland.com.br/wp-content/uploads/2023/11/Docinhos-1024x1024.jpg'],
    ['Consumo na Unidade', 'https://confeitariaiceland.com.br/wp-content/uploads/2025/07/croissant2-300x300.png'],
  ] as const;
  const occasions = [
    ['Aniversário infantil', 'Sabores queridinhos da criançada', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/05/BoloBrigadeiroMorango-300x300.jpg'],
    ['Aniversário adulto', 'Sabores marcantes para celebrar', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/05/BoloMamae3-300x300.jpg'],
    ['Casamento / Noivado', 'Elegância para o grande dia', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/06/TortaMilFolhas3-300x300.jpg'],
    ['Evento corporativo', 'Praticidade e apresentação impecável', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/05/TortaCheeseCakeFrutasDoBosque3-300x300.jpg'],
    ['Outra ocasião', 'Conte pra gente o que está planejando', 'https://confeitariaiceland.com.br/wp-content/uploads/2024/05/TortaLimao3-300x300.jpg'],
  ] as const;
  const featuredIds = ['bolo-brigadeiro-morango', 'torta-cheesecake-frutas-bosque', 'bolo-damasco-castanha'];
  const featured = featuredIds.map((id) => products.find((item) => item.id === id)).filter((item): item is Product => Boolean(item));

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Confeitaria Iceland · Ribeirão Preto</span>
            <h1>Mais de 30 anos transformando momentos em sabores.</h1>
            <p>Bolos artesanais feitos com a mesma tradição que conquistou a cidade — agora com um jeito mais simples de pedir: você escolhe, a gente calcula, você recebe.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => onNavigate('pedido')}>Fazer meu pedido</button>
              <button className="secondary-button" onClick={() => onNavigate('cardapio')}>Ver cardápio</button>
            </div>
          </div>
          <div className="hero-visual">
            <img src="https://confeitariaiceland.com.br/wp-content/uploads/2024/06/BoloMousseMorango4.jpg" alt="Bolo mousse de morango Confeitaria Iceland" />
            <div className="hero-note"><strong>Cardápio completo</strong><span>e um sistema que ajuda você a escolher o certo</span></div>
          </div>
        </div>
      </section>

      <section className="content-section featured-section">
        <div className="wrap">
          <div className="section-heading"><span className="eyebrow">Seleção da casa</span><h2>Alguns dos favoritos de sempre</h2><p>Uma curadoria para começar — o cardápio completo tem opções para todos os gostos.</p></div>
          <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />)}</div>
          <button className="secondary-button section-button" onClick={() => onNavigate('cardapio')}>Ver cardápio completo</button>
        </div>
      </section>

      <section className="content-section paper-section">
        <div className="wrap">
          <div className="section-heading"><span className="eyebrow">Como funciona</span><h2>Você escolhe. A gente calcula. Você envia.</h2><p>Ainda não sabe qual bolo escolher? A gente te ajuda — em menos de 2 minutos seu pedido chega pronto no WhatsApp.</p></div>
          <div className="process-grid">
            <article><b>01</b><h3>Ocasião e tamanho</h3><p>Conte pra quantas pessoas é, e sugerimos o tamanho ideal — ou escolha o peso você mesmo.</p></article>
            <article><b>02</b><h3>Sabor e recheio</h3><p>Já sabe o que quer ou prefere que a gente sugira? As duas opções estão aqui.</p></article>
            <article><b>03</b><h3>Data e entrega</h3><p>Escolha a data e se vai retirar na loja ou receber em casa.</p></article>
            <article><b>04</b><h3>Confirmação</h3><p>Veja o preço calculado e envie o pedido pronto pelo WhatsApp.</p></article>
          </div>
          <button className="primary-button section-button" onClick={() => onNavigate('pedido')}>Ir para Fazer Pedido</button>
        </div>
      </section>

      <section className="content-section tradition-section" id="tradition-home">
        <div className="wrap tradition-grid">
          <img src="https://confeitariaiceland.com.br/wp-content/uploads/2024/06/BoloRedVelvet4.jpg" alt="Bolo artesanal da Confeitaria Iceland" />
          <div><span className="eyebrow light">Nossa história</span><h2>Tradição que ultrapassa gerações.</h2><p>Com muita tradição e requinte, a Iceland está no mercado de Ribeirão Preto há mais de 30 anos, sempre prezando qualidade e inovação. Também atendemos buffets e festas dos mais diversos tamanhos.</p>
            <div className="stats"><div><b>+30</b><span>anos de história em Ribeirão Preto</span></div><div><b>5</b><span>categorias no cardápio</span></div><div><b>2</b><span>cidades atendidas no delivery</span></div></div>
          </div>
        </div>
      </section>

      <section className="content-section"><div className="wrap"><div className="section-heading"><span className="eyebrow">O cardápio</span><h2>Um sabor para cada tipo de desejo</h2></div><div className="category-grid">{categoryImages.map(([name, image]) => <button key={name} onClick={() => onNavigate('cardapio')}><img src={image} alt="" /><span>{name}</span></button>)}</div></div></section>

      <section className="content-section paper-section"><div className="wrap"><div className="section-heading"><span className="eyebrow">Para cada momento</span><h2>Um bolo para cada ocasião</h2></div><div className="occasion-grid-home">{occasions.map(([name, text, image]) => <article key={name}><img src={image} alt="" /><div><h3>{name}</h3><p>{text}</p></div></article>)}</div></div></section>

      <section className="content-section"><div className="wrap"><div className="section-heading"><span className="eyebrow">Quem já pediu</span><h2>O que dizem os clientes</h2></div><div className="testimonial-grid"><p>Espaço reservado para depoimentos reais de clientes.<br />Nenhum depoimento foi inventado — assim que a confeitaria enviar avaliações reais (ou conectar Google/Instagram), elas aparecem aqui.</p><p>Espaço reservado para avaliação real.</p><p>Espaço reservado para avaliação real.</p></div></div></section>

      <section className="final-cta"><div className="wrap"><h2>Seu próximo momento especial começa aqui.</h2><button className="primary-button" onClick={() => onNavigate('pedido')}>Fazer meu pedido <ArrowRight size={17} /></button></div></section>
    </main>
  );
}
