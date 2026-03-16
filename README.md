# Le Bistrô

MVP de gerenciamento de pedidos para restaurante, com foco em fluxo de cozinha, controle de cardápio, ingredientes, receitas e histórico de pedidos.

## Tecnologias utilizadas

### Back-end

- NestJS
- Prisma ORM
- PostgreSQL
- Docker Compose
- Swagger
- WebSocket (Socket.IO)

### Front-end

- Angular standalone
- SCSS
- HttpClient
- WebSocket client

---

## Estrutura do projeto

```bash
le-bistro/
├── le-bistro-api/
└── le-bistro-web/
```

le-bistro-api: API responsável por pedidos, cozinha, cardápio, ingredientes, receitas e estoque

le-bistro-web: aplicação front-end com telas administrativas e operacionais

Funcionalidades principais

Cadastro e consulta de pedidos

Fluxo de status do pedido:

PENDING

CONFIRMED

IN_PREPARATION

READY

DELIVERED

REJECTED_OUT_OF_STOCK

Histórico de alterações do pedido

Dashboard da cozinha em tempo real

Cadastro e administração de itens do cardápio

Cadastro e administração de ingredientes

Vínculo entre pratos e ingredientes por receita

Controle de estoque por ingrediente

Atualização em tempo real com WebSocket

Regras de negócio implementadas
Pedidos

Todo pedido nasce como PENDING

O sistema valida a receita do prato e o estoque disponível

Se houver estoque suficiente:

o pedido é confirmado

o estoque é decrementado

o histórico é registrado

Se não houver estoque suficiente:

o pedido é rejeitado com status REJECTED_OUT_OF_STOCK

o motivo da rejeição é retornado

Cardápio e ingredientes

O cardápio é separado dos ingredientes

O estoque pertence aos ingredientes

Cada prato utiliza uma receita (Recipe) com:

ingrediente

quantidade necessária

Estrutura de domínio
Entidades principais

MenuItem

Ingredient

Recipe

Stock

Order

OrderItem

OrderHistory

Como executar o projeto

1. Clonar o repositório
   git clone <url-do-repositorio>
   cd le-bistro
2. Subir o back-end
   cd le-bistro-api
   npm install
   Configurar variáveis de ambiente

Crie um arquivo .env na pasta le-bistro-api com a variável:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"

Ajuste os valores de acordo com o docker-compose.yml do projeto.

Subir banco de dados
npm run db:up
Aguardar banco
npm run db:wait
Rodar migrations
npm run db:migrate
Rodar seed
npm run db:seed
Rodar a API em modo desenvolvimento
npm run start:dev
Swagger

Com a API rodando, acessar:

http://localhost:3000/docs 3. Subir o front-end
cd ../le-bistro-web
npm install

Depois execute o script de desenvolvimento definido no package.json do front-end.

Exemplos comuns:

npm start

ou

ng serve

A aplicação front-end normalmente estará disponível em:

http://localhost:4200
Scripts úteis do back-end
Desenvolvimento
npm run start:dev
Build
npm run build
Produção
npm run start:prod
Lint
npm run lint
Testes
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
Banco
npm run db:up
npm run db:down
npm run db:reset:volume
npm run db:wait
npm run db:migrate
npm run db:seed
npm run db:reset
Principais endpoints
Pedidos

POST /orders

GET /orders

GET /orders/kitchen

GET /orders/:id

GET /orders/:id/history

PATCH /orders/:id/status

Cardápio

GET /menu-items

GET /menu-items/admin

POST /menu-items

PATCH /menu-items/:id

PATCH /menu-items/:id/status

PUT /menu-items/:id/recipe

Ingredientes

GET /ingredients

POST /ingredients

PATCH /ingredients/:id

PATCH /ingredients/:id/stock

Fluxo operacional do sistema

1. Ingredientes

O administrador cadastra os ingredientes e define o estoque disponível.

2. Cardápio

O administrador cadastra os pratos do cardápio.

3. Receita

Cada prato recebe uma receita com os ingredientes necessários e a quantidade usada de cada um.

4. Pedido

O operador cria um pedido para uma mesa.

5. Validação

O sistema verifica se há receita cadastrada e estoque suficiente.

6. Cozinha

Pedidos confirmados aparecem no dashboard da cozinha e podem avançar de status.

7. Histórico

Cada alteração de status fica registrada no histórico do pedido.

WebSocket

O projeto utiliza atualização em tempo real para refletir alterações de pedidos e cardápio sem necessidade de refresh manual.

Exemplos de atualização em tempo real:

novo pedido criado

alteração de status do pedido

atualização de cardápio

atualização de receita

Observações

O projeto foi construído com foco em MVP

O controle de estoque ocorre por ingrediente

O cardápio é independente do estoque, e a ligação entre os dois ocorre por receita

O front-end utiliza telas administrativas separadas para:

ingredientes

cardápio

cozinha

histórico

criação de pedidos

Melhorias futuras

autenticação e autorização

testes automatizados adicionais

paginação nas listagens

dashboard analítico

upload de imagens para pratos

relatórios de consumo de estoque

Autor

Projeto desenvolvido por Raniff Barroncas.

---

