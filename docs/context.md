# Project Context

## Overview
Sistema de menu online com pedidos para consumo local ou delivery. 
O cliente visualiza o cardápio, adiciona itens ao carrinho, seleciona complementos, realiza login, escolhe o tipo de pedido (delivery ou mesa), preenche os dados necessários e finaliza o pagamento via InfinitePay. 
Após a confirmação do pagamento, o cliente acompanha o status do pedido em tempo real.

---

## Stack
- Backend: NestJS
- Frontend: React Native
- Pagamentos: InfinitePay
- Banco de dados: (definir: PostgreSQL | MongoDB)

---

## Core Concepts

- User:
  Cliente autenticado que realiza pedidos

- Product:
  Item do cardápio disponível para compra

- Complement:
  Adicionais/opcionais de um produto (ex: extra queijo)

- Cart:
  Estrutura temporária onde o cliente adiciona produtos antes do checkout

- Order:
  Pedido finalizado contendo itens, tipo (delivery/local), status e valor total

- OrderItem:
  Representa um item dentro do pedido, incluindo quantidade e complementos

- Address:
  Endereço do cliente (usado apenas para delivery)

- Table:
  Identificador da mesa (usado apenas para consumo local)

- PaymentIntent:
  Intenção de pagamento gerada antes da finalização

- Payment:
  Resultado do pagamento (aprovado, recusado, pendente)

---

## Business Rules

- O pedido só pode ser finalizado com o usuário autenticado
- O carrinho deve conter ao menos 1 item
- O tipo do pedido deve ser obrigatório: DELIVERY ou LOCAL

### Regras para DELIVERY
- Endereço é obrigatório
- Deve utilizar endereço previamente cadastrado ou novo

### Regras para LOCAL
- Número/identificação da mesa é obrigatório

### Pagamento
- O pedido só é criado como "CONFIRMED" após pagamento aprovado
- Pedidos com pagamento recusado ficam como "PENDING_PAYMENT"
- O valor total do pedido deve ser recalculado no backend (não confiar no frontend)

### Complementos
- Devem respeitar regras do produto (obrigatório/opcional, limites de quantidade)

### Segurança
- Nunca confiar em valores enviados pelo frontend
- Validar todos os dados no backend

---

## Architecture

- Padrão: Clean Architecture (adaptado)

Camadas:

- Controller
  - Recebe requisições HTTP
  - Valida DTOs
  - Não contém regra de negócio

- Service (Use Cases)
  - Contém regras de negócio
  - Orquestra fluxo de pedidos e pagamento

- Repository
  - Acesso ao banco de dados
  - Abstração da persistência

- Integration Layer
  - Comunicação com InfinitePay

Fluxo principal:

Controller → Service → Payment Integration → Repository

---

## Patterns

- DTOs para entrada e saída (validação com class-validator)
- Services com responsabilidade única (ex: CreateOrderService)
- Separação clara entre domínio e infraestrutura
- Uso de enums para status (OrderStatus, PaymentStatus)
- Validação centralizada no backend
- Idempotência no processo de pagamento (evitar pedidos duplicados)

---

## Naming Conventions

- camelCase: variáveis e funções
- PascalCase: classes e DTOs
- UPPER_CASE: enums e constantes

### Exemplos

- createOrder()
- OrderService
- CreateOrderDto
- ORDER_STATUS.CONFIRMED