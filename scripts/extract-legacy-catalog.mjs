import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../legacy/iceland-confeitaria.html', import.meta.url), 'utf8');
const start = source.indexOf('var IMG_BASE');
const end = source.indexOf('var OCCASIONS');

if (start < 0 || end < 0) {
  throw new Error('Não foi possível localizar o catálogo no HTML legado.');
}

const context = vm.createContext({});
vm.runInContext(`${source.slice(start, end)};this.result={PRODUCTS,SECONDARY_ITEMS};`, context);

const primary = context.result.PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  description: product.description,
  image: product.image,
  priceCents: Math.round(product.pricePerKg * 100),
  unit: 'kg',
  tags: product.tags,
  fillings: product.fillings,
}));

const unitMap = {
  'und.': 'unidade',
  cento: 'cento',
  caixa: 'caixa',
  '2 und.': 'combo',
  'sob consulta': 'unidade',
};

const secondary = context.result.SECONDARY_ITEMS.map((product, index) => ({
  id: `item-${index + 1}-${product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
  name: product.name,
  category: product.category,
  description: 'Consulte disponibilidade e opções com nossa equipe.',
  image: product.image,
  priceCents: product.price == null ? null : Math.round(product.price * 100),
  unit: unitMap[product.unit] ?? 'unidade',
  tags: [],
  fillings: [],
}));

const serialized = `${JSON.stringify([...primary, ...secondary], null, 2)}\n`;
await Promise.all([
  writeFile(new URL('../apps/web/src/data/catalog.generated.json', import.meta.url), serialized, 'utf8'),
  writeFile(new URL('../apps/api/src/catalog.json', import.meta.url), serialized, 'utf8'),
]);

console.log(`Catálogo migrado: ${primary.length + secondary.length} produtos.`);
