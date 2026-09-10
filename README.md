# Iceland — plataforma digital da confeitaria

Aplicação para apresentar o cardápio, estimar tamanhos e preparar pedidos para atendimento no WhatsApp. O projeto foi organizado como um monorepo para manter a experiência do cliente separada das regras comerciais.

## Arquitetura

```text
apps/web             React + TypeScript + Vite
apps/api             Node.js + Express + Zod
services/pricing     Java 21 + Spring Boot
legacy               versão original preservada
```

- **Web:** catálogo responsivo, busca, filtros, detalhes de produto e pedido guiado.
- **API:** validação, catálogo, prévia do pedido, segurança HTTP e limitação de requisições.
- **Pricing:** regras de preço isoladas em Java, com testes e endpoint de saúde.
- **Fallback seguro:** se o serviço Java estiver temporariamente indisponível, a API calcula a mesma estimativa localmente.

## Requisitos

- Node.js 22+
- npm 11+
- Java 21 e Maven 3.9+ para executar o serviço de preços sem Docker
- Docker Compose para subir a solução completa

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev:web
npm run dev:api
```

Em outro terminal, para o serviço Java:

```bash
cd services/pricing
mvn spring-boot:run
```

Ou execute todos os serviços:

```bash
docker compose up --build
```

- Site: `http://localhost:8088`
- API: `http://localhost:3001`
- Pricing: `http://localhost:8080`

## Qualidade

```bash
npm test
npm run build
cd services/pricing && mvn verify
```

O GitHub Actions repete essas verificações em cada push e pull request.

## Publicação

O workflow `pages.yml` publica o frontend no GitHub Pages. No repositório, configure:

1. **Settings → Pages → Source:** GitHub Actions.
2. **Settings → Secrets and variables → Actions → Variables:** crie `WHATSAPP_NUMBER` com apenas os dígitos do número oficial.
3. Confirme preços, taxa de entrega, horários e antecedência mínima antes da publicação comercial.

As APIs Node e Java são distribuídas como containers e podem ser hospedadas em qualquer plataforma compatível com Docker.

## Segurança e privacidade

- Entradas são renderizadas como texto no React, sem injeção de HTML.
- A API limita o tamanho do corpo, valida todos os campos e aplica cabeçalhos seguros.
- Nenhum pedido é armazenado ou enviado automaticamente: o cliente revisa a mensagem no WhatsApp.
- O rascunho fica apenas no navegador do cliente e pode ser apagado limpando os dados do site.

## Atualização do catálogo

O catálogo migrado fica em `apps/web/src/data/catalog.generated.json`. Durante a transição, o comando abaixo recria os arquivos de dados a partir da versão legada:

```bash
node scripts/extract-legacy-catalog.mjs
```

Depois de validar o novo catálogo com a confeitaria, os dados devem migrar para uma fonte administrativa própria.
