import { ArrowLeft, ArrowRight, Check, MapPin, MessageCircle, Minus, Plus, Store } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { formatCurrency } from '../lib/currency';
import { buildWhatsAppMessage, deliveryFeeCents, emptyOrder, formatDate, minimumOrderDate, orderTotal, suggestedWeight } from '../lib/order';
import type { OrderDraft, Product } from '../types';

const occasions = ['Aniversário infantil', 'Aniversário adulto', 'Casamento / Noivado', 'Evento corporativo', 'Outra ocasião'];
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '551636107700';

export function OrderPage({ initialProduct }: { initialProduct: Product | null }) {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<OrderDraft>(() => {
    try {
      const saved = localStorage.getItem('iceland-order-draft');
      return saved ? { ...emptyOrder, ...JSON.parse(saved) } : emptyOrder;
    } catch {
      return emptyOrder;
    }
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (initialProduct) setOrder((current) => ({ ...current, productId: initialProduct.id }));
  }, [initialProduct]);
  useEffect(() => localStorage.setItem('iceland-order-draft', JSON.stringify(order)), [order]);

  const selectedProduct = products.find((product) => product.id === order.productId);
  const total = orderTotal(selectedProduct, order);
  const productOptions = useMemo(() => products.filter((product) => product.unit === 'kg' && product.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [search]);
  const setField = <K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) => setOrder((current) => ({ ...current, [field]: value }));
  const setAddress = (field: keyof OrderDraft['address'], value: string) => setOrder((current) => ({ ...current, address: { ...current.address, [field]: value } }));
  const canContinue = step === 1 ? Boolean(order.occasion) : step === 2 ? order.weightKg > 0 : step === 3 ? Boolean(order.productId) : step === 4 ? Boolean(order.date) && (order.fulfillment === 'pickup' || Boolean(order.address.street && order.address.number && order.address.district && order.address.postalCode)) : true;

  const updatePeople = (people: number) => {
    const safePeople = Math.min(300, Math.max(5, people));
    setOrder((current) => ({ ...current, people: safePeople, weightKg: suggestedWeight(safePeople) }));
  };
  const sendToWhatsApp = () => {
    if (!selectedProduct) return;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(selectedProduct, order, total))}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="order-page">
      <header className="page-intro compact"><span className="eyebrow">Fazer pedido</span><h1>Vamos montar o seu bolo</h1><p>Escolha algumas opções e nós calculamos tudo para você.</p></header>
      <div className="order-layout">
        <section className="order-workspace">
          <ol className="stepper" aria-label="Etapas do pedido">{['Ocasião', 'Tamanho', 'Sabor', 'Entrega', 'Revisão'].map((label, index) => <li key={label} className={step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''}><span>{step > index + 1 ? <Check size={14} /> : index + 1}</span>{label}</li>)}</ol>

          {step === 1 && <div className="order-step"><span className="eyebrow">01 · Ocasião</span><h2>Qual é o momento?</h2><p className="field-hint">Isso ajuda a equipe a entender o estilo da celebração e orientar sua escolha.</p><div className="choice-grid occasion-grid">{occasions.map((occasion) => <button key={occasion} className={order.occasion === occasion ? 'selected' : ''} onClick={() => setField('occasion', occasion)}>{occasion}{order.occasion === occasion && <Check size={17} />}</button>)}</div></div>}

          {step === 2 && <div className="order-step"><span className="eyebrow">02 · Tamanho</span><h2>Para quantas pessoas?</h2><p className="field-hint">Sugerimos um peso inicial. O tamanho final será confirmado pela equipe.</p><div className="people-control"><div><label>Quantidade de pessoas</label><p>Sugestão: {order.weightKg.toLocaleString('pt-BR')} kg.</p></div><div className="number-control"><button onClick={() => updatePeople(order.people - 5)} aria-label="Diminuir pessoas"><Minus /></button><strong>{order.people}</strong><button onClick={() => updatePeople(order.people + 5)} aria-label="Aumentar pessoas"><Plus /></button></div></div><label className="field-label">Ou escolha o peso desejado em kg<input type="number" min="1" max="30" step="0.5" value={order.weightKg} onChange={(event) => setField('weightKg', Number(event.target.value))} /></label></div>}

          {step === 3 && <div className="order-step"><span className="eyebrow">03 · Sabor e recheio</span><h2>Qual sabor você quer celebrar?</h2><p className="field-hint">Já sabe o que quer? Busque pelo nome ou explore as opções abaixo.</p><input className="standalone-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar sabor" aria-label="Buscar sabor" /><div className="choice-grid product-choices">{productOptions.map((product) => <button key={product.id} className={order.productId === product.id ? 'selected' : ''} onClick={() => setField('productId', product.id)}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.fillings?.[0] ?? (product.priceCents ? `${formatCurrency(product.priceCents)} / kg` : 'Sob consulta')}</small></span>{order.productId === product.id && <Check size={18} />}</button>)}</div></div>}

          {step === 4 && <div className="order-step"><span className="eyebrow">04 · Data e entrega</span><h2>Quando e onde?</h2><label className="field-label">Data desejada<input type="date" min={minimumOrderDate()} value={order.date} onChange={(event) => setField('date', event.target.value)} /></label><p className="field-hint">Pedidos precisam de pelo menos dois dias de antecedência. A disponibilidade será confirmada pela equipe.</p><div className="choice-grid fulfillment-grid"><button className={order.fulfillment === 'pickup' ? 'selected' : ''} onClick={() => setField('fulfillment', 'pickup')}><Store /><span><strong>Retirar na loja</strong><small>Av. Nove de Julho, 1614</small></span></button><button className={order.fulfillment === 'delivery' ? 'selected' : ''} onClick={() => setField('fulfillment', 'delivery')}><MapPin /><span><strong>Receber em casa</strong><small>Taxa estimada de {formatCurrency(deliveryFeeCents)}</small></span></button></div>{order.fulfillment === 'delivery' && <div className="address-grid"><label>CEP<input value={order.address.postalCode} onChange={(event) => setAddress('postalCode', event.target.value)} placeholder="00000-000" inputMode="numeric" /></label><label>Bairro<input value={order.address.district} onChange={(event) => setAddress('district', event.target.value)} /></label><label className="wide">Rua<input value={order.address.street} onChange={(event) => setAddress('street', event.target.value)} /></label><label>Número<input value={order.address.number} onChange={(event) => setAddress('number', event.target.value)} /></label><label>Complemento<input value={order.address.complement} onChange={(event) => setAddress('complement', event.target.value)} /></label></div>}</div>}

          {step === 5 && selectedProduct && <div className="order-step"><span className="eyebrow">05 · Revisão</span><h2>Confira antes de conversar.</h2><div className="review-list"><div><span>Ocasião</span><strong>{order.occasion}</strong></div><div><span>Tamanho</span><strong>{order.weightKg.toLocaleString('pt-BR')} kg · cerca de {order.people} pessoas</strong></div><div><span>Sabor</span><strong>{selectedProduct.name}</strong></div><div><span>Data</span><strong>{formatDate(order.date)}</strong></div><div><span>Recebimento</span><strong>{order.fulfillment === 'pickup' ? 'Retirada na loja' : 'Entrega no endereço informado'}</strong></div></div><div className="review-fields"><label>Seu nome<input value={order.customerName} onChange={(event) => setField('customerName', event.target.value)} placeholder="Como podemos chamar você?" /></label><label>Observações<textarea value={order.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Mensagem no bolo, restrições ou detalhes importantes" rows={4} /></label></div><button className="whatsapp-button" onClick={sendToWhatsApp}><MessageCircle /> Preparar mensagem no WhatsApp</button><p className="field-hint centered">A mensagem será aberta para sua conferência. O pedido só é confirmado depois que a equipe responder.</p></div>}

          <div className="order-navigation"><button className="secondary-button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}><ArrowLeft size={18} /> Voltar</button>{step < 5 && <button className="primary-button" onClick={() => setStep((current) => Math.min(5, current + 1))} disabled={!canContinue}>Continuar <ArrowRight size={18} /></button>}</div>
        </section>

        <aside className="order-summary"><span className="eyebrow">Seu pedido</span>{selectedProduct ? <><img src={selectedProduct.image} alt="" /><h2>{selectedProduct.name}</h2><dl><div><dt>Ocasião</dt><dd>{order.occasion || '—'}</dd></div><div><dt>Tamanho</dt><dd>{order.weightKg.toLocaleString('pt-BR')} kg</dd></div><div><dt>Recebimento</dt><dd>{order.fulfillment === 'pickup' ? 'Retirada' : 'Entrega'}</dd></div></dl><div className="estimated-total"><span>Valor estimado</span><strong>{total ? formatCurrency(total) : 'Sob consulta'}</strong></div><p>O valor e a disponibilidade serão confirmados pela confeitaria.</p></> : <p>Escolha a ocasião, o tamanho e o sabor para montar seu pedido.</p>}</aside>
      </div>
    </main>
  );
}
