# Regras de Negócio — Realizar Pedido

## Visão Geral

Um pedido (`Order`) representa a intenção de compra de um cliente. Cada pedido é composto por um ou mais itens, um endereço de entrega, e passa por um ciclo de vida controlado pelo status.

---

## Estrutura de um Pedido

```
Order
 ├── userId          — ID do usuário que realizou o pedido
 ├── status          — Status atual (começa em WAITING_PAYMENT)
 ├── totalPrice      — Soma dos totais de todos os itens
 ├── address         — Endereço de entrega (embutido no pedido)
 └── items[]         — Lista de OrderItem
       ├── product       — Produto pedido
       ├── quantity      — Quantidade
       ├── basePrice     — Preço base do produto no momento do pedido
       └── totalPrice    — (basePrice + soma das opções) × quantidade
```

---

## Hierarquia de Produtos e Opções

```
Product
 └── optionGroups[]         — Grupos de opções vinculados ao produto
       ├── name             — Ex: "Ponto da Carne", "Adicionais"
       ├── required         — Se o cliente é obrigado a escolher
       ├── minSelection     — Mínimo de opções selecionáveis
       ├── maxSelection     — Máximo de opções selecionáveis
       └── options[]        — Opções disponíveis dentro do grupo
             ├── name       — Ex: "Bacon", "Ao ponto"
             └── price      — Acréscimo ao preço base (pode ser 0.00)
```

> **Regra fundamental:** Uma `ProductOption` pertence a um `ProductOptionGroup`, que pertence a um `Product`. Opções de um produto **não podem** ser enviadas em pedidos de outro produto.

---

## Regras para Criar um Pedido

### 1. Itens obrigatórios

| Campo | Obrigatório | Descrição |
|---|---|---|
| `userId` | Sim | ID do usuário autenticado |
| `items` | Sim | Lista com pelo menos 1 item |
| `addressId` ou `address` | Sim (um dos dois) | Endereço de entrega |

### 2. Resolução do endereço

- Se `addressId` for informado → o sistema busca o endereço salvo pelo usuário. Se não existir, retorna erro.
- Se `addressId` for `null` → o campo `address` (inline) é usado.
- Se **nenhum** dos dois for fornecido → erro: `"É necessário informar um endereço ou um addressId para o pedido"`.

### 3. Validação dos itens

Para cada item em `items[]`:

1. O `productId` deve corresponder a um produto existente. Caso contrário: `"Produto não encontrado: {id}"`.
2. As `optionsIds` informadas devem pertencer ao produto do item:
   - O sistema verifica se `option.group.product.id == item.productId`.
   - Se uma opção pertencer a outro produto → erro: `"Opção '{nome}' não pertence ao produto '{nome}'"`.

### 4. Cálculo de preço

```
preço do item = (basePrice do produto + soma dos preços das opções selecionadas) × quantidade
total do pedido = soma dos preços de todos os itens
```

**Exemplo:**

```
Produto: X-Burguer          basePrice = R$ 25,00
  + Bacon                   option.price = R$ 5,00
  + Queijo extra             option.price = R$ 2,00
  Quantidade: 2

preço do item = (25,00 + 5,00 + 2,00) × 2 = R$ 64,00
```

### 5. Status inicial

Todo pedido é criado com status `WAITING_PAYMENT` independente do método de pagamento.

---

## Ciclo de Vida do Status

```
WAITING_PAYMENT → PAID → IN_PREPARATION → SENT → DELIVERED
                                                ↘
                                              CANCELED  (pode ocorrer em qualquer etapa antes de DELIVERED)
```

| Status | Descrição |
|---|---|
| `WAITING_PAYMENT` | Pedido criado, aguardando confirmação de pagamento |
| `PAID` | Pagamento confirmado |
| `IN_PREPARATION` | Estabelecimento está preparando o pedido |
| `SENT` | Pedido saiu para entrega |
| `DELIVERED` | Pedido entregue ao cliente |
| `CANCELED` | Pedido cancelado |

---

## Payload de Exemplo

```json
POST /api/v1/client/orders

{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "addressId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "items": [
    {
      "productId": "a1000000-0000-0000-0000-000000000001",
      "quantity": 2,
      "optionsIds": [
        "c1000000-0000-0000-0000-000000000001",
        "c1000000-0000-0000-0000-000000000004",
        "c1000000-0000-0000-0000-000000000008"
      ]
    },
    {
      "productId": "a1000000-0000-0000-0000-000000000003",
      "quantity": 1,
      "optionsIds": [
        "c1000000-0000-0000-0000-000000000018",
        "c1000000-0000-0000-0000-000000000022"
      ]
    }
  ]
}
```

**Cálculo do exemplo acima:**

| Item | Detalhes | Total |
|---|---|---|
| X-Burguer ×2 | R$25,00 + Ao ponto R$0,00 + Bacon R$5,00 + Batata frita R$0,00 = R$30,00 × 2 | R$ 60,00 |
| Refrigerante ×1 | R$8,00 + Coca-Cola R$0,00 + Lata 350ml R$0,00 = R$8,00 × 1 | R$ 8,00 |
| **Total do Pedido** | | **R$ 68,00** |

---

## Erros Possíveis

| Situação | Mensagem de erro |
|---|---|
| Produto não encontrado | `Produto não encontrado: {uuid}` |
| Opção pertence a outro produto | `Opção '{nome}' não pertence ao produto '{nome}'` |
| Endereço salvo não encontrado | `Endereço não encontrado: {uuid}` |
| Nenhum endereço informado | `É necessário informar um endereço ou um addressId para o pedido` |
