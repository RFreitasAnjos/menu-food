# Changelog

Todas as mudanças notáveis deste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adota [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Planejado
- Dashboard administrativo completo (CRUD de produtos e pedidos)
- Integração com gateway de pagamento
- Notificações em tempo real via WebSocket
- Fluxo de cadastro e recuperação de senha

---

## [0.5.0] — 2026

### Adicionado
- Modal de pedido com grupos de opções dinâmicos vindos do backend (`ProductOptionGroup`)
- Suporte a grupos de seleção única (radio) e múltipla (checkbox) com limites configuráveis
- Badge "Obrigatório" em grupos de opções com `minSelection > 0`

### Corrigido
- Grupos de seleção única (radio) não bloqueiam mais as outras opções após uma ser selecionada

---

## [0.4.0] — 2026

### Adicionado
- Página de histórico de pedidos (`/historic`) com status e itens
- Página de perfil do usuário (`/profile`)
- Tipagens `OrderResponse` e `OrderItemResponse` no cliente HTTP

---

## [0.3.0] — 2026

### Adicionado
- Autenticação via cookies `HttpOnly` com access token (15 min) e refresh token (7 dias)
- Endpoints separados para login de clientes (`/api/v1/auth/login`) e administradores (`/api/v1/auth/admin/login`)
- Auto-refresh transparente no cliente HTTP do frontend ao receber `401`
- Entidade e serviço de `RefreshToken` com revogação no logout
- Rota e página de login administrativo (`/admin/login`)
- Placeholder do dashboard admin (`/admin`) com guarda de rota `ROLE_ADMIN`
- `AuthContext` reescrito sem `localStorage`

---

## [0.2.0] — 2026

### Adicionado
- Cliente HTTP tipado (`api/api.ts`) com `credentials: "include"`
- Integração de produtos e usuários com o backend
- Tipo `FoodItem.id` como UUID string
- Contexto de autenticação (`AuthContext`) com dropdown no Navbar

---

## [0.1.0] — 2026

### Adicionado
- Interface completa do cardápio com filtro por categoria
- Carrinho de compras com adição, edição e remoção de itens
- Suporte a internacionalização (PT-BR, EN, ES)
- Tema claro/escuro persistente
- Navbar responsivo com menu mobile
- Footer com horários de funcionamento e redes sociais
- Páginas: homepage, login, carrinho, mais opções
- Docker Compose para PostgreSQL local
- Backend com Clean Architecture (Spring Boot 3 + Java 21)
- Segurança com Spring Security + JWT
- Documentação Swagger/OpenAPI
