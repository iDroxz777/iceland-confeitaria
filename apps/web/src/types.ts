export type ProductCategory = 'Bolos' | 'Tortas' | 'Bolos Caseiros' | 'Docinhos e Sobremesas' | 'Consumo na Unidade';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  priceCents: number | null;
  unit: 'kg' | 'unidade' | 'cento' | 'caixa' | 'combo';
  tags?: string[];
  fillings?: string[];
}

export type AppView = 'inicio' | 'cardapio' | 'pedido';

export interface OrderDraft {
  productId: string;
  occasion: string;
  people: number;
  weightKg: number;
  date: string;
  fulfillment: 'pickup' | 'delivery';
  customerName: string;
  notes: string;
  address: {
    postalCode: string;
    street: string;
    number: string;
    district: string;
    complement: string;
  };
}
