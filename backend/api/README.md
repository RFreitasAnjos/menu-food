# MenuFood API

API REST para gerenciamento de pedidos de delivery de comida. Desenvolvida com Spring Boot 3, Java 21, PostgreSQL e autenticação via JWT.

---

## Tecnologias

- Java 21
- Spring Boot 3
- Spring Security + JWT (jjwt 0.12.6)
- BCrypt (senhas)
- PostgreSQL
- JPA / Hibernate
- Lombok
- Springdoc OpenAPI (Swagger UI)

---

## Como executar

### Pré-requisitos
- Java 21
- PostgreSQL rodando na porta `5432`
- Banco de dados `menufood` criado

### Configuração (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/menufood
spring.datasource.username=postgres
spring.datasource.password=postgres
security.jwt.secret=<chave-secreta-base64>
security.jwt.expiration-ms=86400000
```

### Iniciar
```bash
./mvnw spring-boot:run
```

### Swagger UI
Disponível em: `http://localhost:8080/swagger-ui/index.html`

---

## Usuário Admin Padrão

Na primeira inicialização, a aplicação cria automaticamente um usuário administrador:

| Campo | Valor |
|-------|-------|
| Email | `admin@menufood.com` |
| Senha | `Admin@123` |

> Se o usuário já existir no banco, nenhuma ação é realizada.

---

## Autenticação

A API utiliza **JWT Bearer Token** para autenticação. Todo endpoint protegido exige o header:

```
Authorization: Bearer <token>
```

### Login

**`POST /api/v1/auth/login`** — Público

Request:
```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## Controle de Acesso

| Rota | Acesso |
|------|--------|
| `POST /api/v1/auth/login` | Público |
| `POST /api/v1/client/users` | Público (cadastro) |
| `/swagger-ui/**`, `/v3/api-docs/**` | Público |
| `GET /api/v1/client/products/**` | Autenticado |
| `POST /api/v1/client/orders` | Autenticado |
| `GET /api/v1/client/users/me` | Autenticado |
| `GET/POST/DELETE /api/v1/client/users/me/addresses` | Autenticado |
| `/api/v1/admin/**` | Somente `ADMIN` |

---

## Regras de Negócio

### Usuários

#### Cadastro — `POST /api/v1/client/users`
- A **role é sempre forçada para `CLIENT`** no domínio, independente do que vier no request. Isso impede que um usuário se cadastre como administrador.
- A **senha é hasheada com BCrypt** antes de ser persistida. Nunca é armazenada em texto puro.
- `createdAt` é preenchido automaticamente no momento do cadastro.
- Campos expostos na resposta: `id`, `name`, `email`, `role`, `createdAt` — a **senha nunca é retornada**.

#### Perfil — `GET /api/v1/client/users/me`
- Retorna os dados do usuário autenticado via token JWT.

#### Roles disponíveis
| Role | Descrição |
|------|-----------|
| `CLIENT` | Usuário comum. Acessa produtos e cria pedidos. |
| `ADMIN` | Administrador. Gerencia produtos, opções e usuários. |

---

### Endereços do Usuário

Um usuário pode cadastrar **múltiplos endereços** salvos, identificados por um `label` (ex: "Casa", "Trabalho"). Esses endereços podem ser reutilizados ao criar pedidos.

#### Listar endereços — `GET /api/v1/client/users/me/addresses`
- Retorna todos os endereços salvos do usuário autenticado.

#### Cadastrar endereço — `POST /api/v1/client/users/me/addresses`

Request:
```json
{
  "label": "Casa",
  "street": "Rua das Flores",
  "number": "100",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100"
}
```

- O campo `label` é opcional e serve apenas como identificador amigável.
- O endereço fica vinculado ao usuário autenticado.

#### Remover endereço — `DELETE /api/v1/client/users/me/addresses/{addressId}`
- Só é possível remover um endereço que pertença ao próprio usuário autenticado. Tentar remover um endereço de outro usuário resulta em erro.

---

### Produtos

#### Estrutura de um Produto
```
Product
 └── ProductOptionGroup  (ex: "Adicionais", "Molhos", "Tamanho")
      └── ProductOption  (ex: "Cebola caramelizada + R$2,50", "Molho especial + R$1,00")
```

#### Listagem — `GET /api/v1/client/products`
- Retorna todos os produtos com seus grupos de opções e as opções de cada grupo.

#### Detalhe — `GET /api/v1/client/products/{id}`
- Retorna um produto específico com toda a hierarquia de opções.

#### Criar produto — `POST /api/v1/admin/products` *(somente ADMIN)*
- `isActive` é **sempre definido como `true`** na criação — não depende do request.
- Categorias disponíveis: `FOOD`, `DRINK`, `DESSERT`.

#### Atualizar produto — `PUT /api/v1/admin/products/{id}` *(somente ADMIN)*
- **Partial update**: apenas os campos não-nulos do request são atualizados. Campos ausentes (null) mantêm o valor existente.

#### Excluir produto — `DELETE /api/v1/admin/products/{id}` *(somente ADMIN)*
- Verifica existência antes de deletar. Lança erro se o produto não existir.

#### Mais vendidos — `GET /api/v1/admin/products/most-sold` *(somente ADMIN)*
- Retorna produtos ordenados do mais vendido para o menos, contando pelo número de itens de pedido vinculados.

---

### Grupos de Opções — `POST /api/v1/admin/products/option-groups` *(somente ADMIN)*

Um grupo de opções é **obrigatoriamente vinculado a um produto** e define as regras de seleção.

Request:
```json
{
  "productId": "uuid-do-produto",
  "name": "Adicionais",
  "required": false,
  "minSelection": 0,
  "maxSelection": 3
}
```

| Campo | Descrição |
|-------|-----------|
| `productId` | Produto ao qual o grupo pertence |
| `required` | Se o cliente é obrigado a selecionar ao menos uma opção |
| `minSelection` | Quantidade mínima de opções que podem ser selecionadas |
| `maxSelection` | Quantidade máxima de opções que podem ser selecionadas |

- Se o produto não existir, lança erro.

---

### Opções de Produto — `POST /api/v1/admin/products/options` *(somente ADMIN)*

Uma opção é **vinculada a um grupo** e possui nome e preço adicional.

Request:
```json
{
  "groupId": "uuid-do-grupo",
  "name": "Cebola caramelizada",
  "price": 2.50
}
```

- Se o grupo não existir, lança erro.
- O `price` representa o **valor adicional** ao preço base do produto.

---

### Pedidos

#### Criar pedido — `POST /api/v1/client/orders`

O envio do endereço de entrega pode ser feito de duas formas:

**Opção 1 — Usar endereço salvo:**
```json
{
  "userId": "uuid-do-usuario",
  "addressId": "uuid-do-endereco-salvo",
  "items": [...]
}
```

**Opção 2 — Endereço avulso (sem salvar):**
```json
{
  "userId": "uuid-do-usuario",
  "address": {
    "street": "Rua Augusta",
    "number": "200",
    "neighborhood": "Consolação",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01305-000"
  },
  "items": [...]
}
```

> Se `addressId` e `address` forem enviados juntos, o `addressId` tem prioridade.  
> Se nenhum for informado, o pedido é rejeitado.

#### Cálculo do total

Para cada item do pedido:

$$\text{itemTotal} = (\text{basePrice} + \sum{\text{preços das opções selecionadas}}) \times \text{quantidade}$$

$$\text{totalPedido} = \sum{\text{itemTotal}}$$

#### Status inicial
Todo pedido é criado com status **`WAITING_PAYMENT`**.

#### Ciclo de vida do pedido
```
WAITING_PAYMENT → PAID → IN_PREPARATION → SENT → DELIVERED
                                                 ↘ CANCELED
```
> Atualmente apenas a criação com `WAITING_PAYMENT` está implementada.

---

### Gerenciamento Admin — `/api/v1/admin`

Todos os endpoints abaixo exigem `ROLE_ADMIN`.

#### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/admin/users` | Lista todos os usuários |
| `PATCH` | `/admin/users/{id}/role` | Altera a role de um usuário |

#### Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/admin/products` | Lista todos os produtos |
| `POST` | `/admin/products` | Cria produto |
| `PUT` | `/admin/products/{id}` | Atualiza produto (partial update) |
| `DELETE` | `/admin/products/{id}` | Remove produto |
| `GET` | `/admin/products/most-sold` | Produtos mais vendidos |
| `POST` | `/admin/products/option-groups` | Cria grupo de opções para um produto |
| `POST` | `/admin/products/options` | Cria opção dentro de um grupo |

---

## Modelo de Dados

```
users
 ├── id, name, email, password (BCrypt), role, createdAt, updatedAt

user_addresses
 ├── id, user_id (FK), label, street, number, neighborhood, city, state, zipCode, isDefault

products
 ├── id, name, description, imageUrl, category, basePrice, isActive

product_option_groups
 ├── id, product_id (FK), name, required, minSelection, maxSelection

product_options
 ├── id, group_id (FK), name, price

orders
 ├── id, userId, status, totalPrice, createdAt
 └── address (embutido: street, number, neighborhood, city, state, zipCode)

order_items
 └── id, order_id (FK), product_id (FK), quantity, basePrice, totalPrice
```
