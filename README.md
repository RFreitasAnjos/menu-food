# MenuFood 🍽️

Plataforma full-stack de pedidos de comida com cardápio digital, autenticação segura por cookies HttpOnly e painel administrativo.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green?logo=springboot)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Organização de Pastas](#organização-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Como Inicializar o Projeto](#como-inicializar-o-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Funcionalidades](#funcionalidades)
- [Implementações Futuras](#implementações-futuras)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão Geral

O **MenuFood** é um sistema de pedidos de comida que permite:

- Clientes navegarem pelo cardápio, filtrarem por categoria, montarem pedidos com grupos de opções (tamanhos, adicionais) e acompanharem o histórico de pedidos.
- Administradores gerenciarem produtos, categorias e pedidos por um painel dedicado.
- Suporte a múltiplos idiomas: **Português (PT-BR)**, **English (EN)** e **Español (ES)**.
- Tema claro/escuro persistente.

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Backend | Java + Spring Boot | 21 / 3.5.x |
| ORM | Spring Data JPA + Hibernate | — |
| Segurança | Spring Security + JWT (HttpOnly cookies) | jjwt 0.12.6 |
| Banco de Dados | PostgreSQL | 16 |
| Documentação API | SpringDoc OpenAPI (Swagger UI) | 2.8.x |
| Frontend | Next.js (App Router) | 16.2.3 |
| UI | React + Tailwind CSS v4 | 19 / 4.x |
| Ícones | Lucide React | 1.8.x |
| Linguagem | TypeScript | 5.x |
| Infraestrutura | Docker + Docker Compose | — |

---

## Arquitetura

### Backend — Clean Architecture

O backend segue os princípios de **Clean Architecture**, dividindo responsabilidades em camadas isoladas:

```
domain/          ← Entidades e enums de negócio (sem dependências externas)
application/     ← Use cases e DTOs (orquestram regras de negócio)
adapters/
  in/            ← Controllers REST (entrypoints HTTP)
  out/           ← Repositórios JPA (persistence adapters)
infrastructure/  ← Configurações, segurança, inicialização de dados
```

**Fluxo de autenticação:**
1. Login via `POST /api/v1/auth/login` (CLIENT) ou `/api/v1/auth/admin/login` (ADMIN).
2. O servidor gera um **access token** (15 min) e um **refresh token** (7 dias), ambos entregues como cookies `HttpOnly; Secure; SameSite=Strict`.
3. O `JwtAuthFilter` lê o cookie `access_token` em cada requisição (com fallback para header `Authorization: Bearer`).
4. Quando o access token expira, o frontend chama automaticamente `POST /api/v1/auth/refresh`.
5. Logout revoga o refresh token do banco e limpa os cookies.

**Roles:**
- `CLIENT` — acesso às rotas `/api/v1/client/**`
- `ADMIN` — acesso às rotas `/api/v1/admin/**`

### Frontend — Next.js App Router

```
app/             ← Rotas (cada pasta = uma rota)
  components/    ← Componentes reutilizáveis (UI + layout)
  contexts/      ← Providers globais (Auth, Cart, Language, Theme)
  types/         ← Tipos TypeScript compartilhados
  constants/     ← Constantes (categorias, extras mock)
api/             ← Cliente HTTP tipado (fetch com auto-refresh)
public/i18n/     ← Traduções JSON (pt.json, en.json, es.json)
```

O cliente HTTP (`api/api.ts`) envia todas as requisições com `credentials: "include"` e intercepta respostas `401` para tentar o refresh automaticamente antes de rejeitar a operação.

---

## Organização de Pastas

```
menu-food/
├── backend/
│   └── api/
│       ├── docker-compose.yml                  # PostgreSQL local
│       ├── pom.xml
│       └── src/main/java/br/com/menufood/api/
│           ├── ApiApplication.java
│           ├── adapters/
│           │   ├── in/controllers/
│           │   │   ├── authcontroller/         # Login, logout, refresh
│           │   │   ├── usercontroller/         # Perfil, endereços, pedidos
│           │   │   ├── productcontroller/      # Listagem e detalhes de produtos
│           │   │   ├── ordercontroller/        # Criação de pedidos
│           │   │   └── admincontroller/        # CRUD admin (produtos, pedidos)
│           │   └── out/persistence/            # Repositórios JPA
│           ├── application/
│           │   ├── dto/                        # Request/Response DTOs
│           │   └── usecases/                   # Lógica de negócio
│           ├── domain/
│           │   ├── entities/                   # User, Product, Order, OrderItem, ...
│           │   ├── enums/                      # UserRole, OrderStatus, Category
│           │   └── valueobject/
│           └── infrastructure/
│               ├── config/SecurityConfig.java
│               ├── database/DataInitializer.java
│               └── security/                   # JwtService, JwtAuthFilter, ...
└── frontend/
    ├── api/api.ts                               # Cliente HTTP tipado
    ├── app/
    │   ├── layout.tsx                           # Root layout com providers
    │   ├── page.tsx                             # Homepage (cardápio público)
    │   ├── login/page.tsx                       # Login de clientes
    │   ├── register/page.tsx                    # Cadastro de clientes
    │   ├── recovery/page.tsx                    # Recuperação de senha
    │   ├── cart/page.tsx                        # Carrinho de compras
    │   ├── historic/page.tsx                    # Histórico de pedidos
    │   ├── profile/page.tsx                     # Perfil do usuário
    │   ├── more-options/page.tsx                # Informações adicionais
    │   ├── admin/
    │   │   ├── login/page.tsx                   # Login administrativo
    │   │   └── page.tsx                         # Dashboard admin (protegido)
    │   ├── components/ui/                       # Navbar, Card, Filter, Footer, ...
    │   ├── contexts/                            # AuthContext, CartContext, ...
    │   ├── types/index.ts                       # FoodItem, CartItem, Extra
    │   └── constants/                           # Dados mock e categorias
    ├── public/
    │   ├── i18n/                                # pt.json, en.json, es.json
    │   └── Mocks/                               # foods.mock.ts
    └── package.json
```

---

## Pré-requisitos

| Ferramenta | Versão mínima | Link |
|---|---|---|
| Java (JDK) | 21 | [Download](https://adoptium.net/) |
| Maven | 3.9+ | [Download](https://maven.apache.org/) |
| Node.js | 18+ | [Download](https://nodejs.org/) |
| Docker + Docker Compose | 24+ | [Download](https://www.docker.com/) |

---

## Como Inicializar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/menu-food.git
cd menu-food
```

### 2. Subir o banco de dados (PostgreSQL via Docker)

```bash
cd backend/api
docker compose up -d
```

O container `menufood-postgres` ficará disponível em `localhost:5432` com o banco `menufood`.

### 3. Iniciar o backend

```bash
# Ainda dentro de backend/api/
mvn spring-boot:run
```

O servidor inicia em `http://localhost:8080`.

> Na primeira execução, o `DataInitializer` cria automaticamente um usuário administrador padrão:
> - **E-mail:** `admin@menufood.com`
> - **Senha:** `Admin@123`

A documentação Swagger estará disponível em `http://localhost:8080/swagger-ui/index.html`.

### 4. Instalar dependências e iniciar o frontend

```bash
cd ../../frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:3000`.

### Resumo dos serviços

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| PostgreSQL | localhost:5432 |

---

## Variáveis de Ambiente

### Backend (`application.properties`)

| Propriedade | Padrão | Descrição |
|---|---|---|
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/menufood` | URL do banco |
| `spring.datasource.username` | `postgres` | Usuário do banco |
| `spring.datasource.password` | `postgres` | Senha do banco |
| `security.jwt.secret` | *(valor em hex no arquivo)* | Chave secreta JWT — **altere em produção** |
| `security.jwt.expiration-ms` | `900000` (15 min) | Validade do access token |
| `security.jwt.refresh-expiration-days` | `7` | Validade do refresh token |

### Frontend (`.env.local`)

Crie o arquivo `frontend/.env.local` com o conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Login de clientes | Pública |
| POST | `/api/v1/auth/admin/login` | Login de administradores | Pública |
| POST | `/api/v1/auth/refresh` | Renovar access token | Cookie refresh_token |
| POST | `/api/v1/auth/logout` | Logout (revoga refresh token) | Cookie access_token |

### Usuários (CLIENT)

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/v1/client/users` | Cadastro de novo cliente |
| GET | `/api/v1/client/users/me` | Dados do perfil autenticado |
| GET | `/api/v1/client/users/me/orders` | Histórico de pedidos |
| GET | `/api/v1/client/users/me/addresses` | Listar endereços |
| POST | `/api/v1/client/users/me/addresses` | Adicionar endereço |
| DELETE | `/api/v1/client/users/me/addresses/{id}` | Remover endereço |

### Produtos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/client/products` | Listar produtos (com filtro de categoria) |
| GET | `/api/v1/client/products/{id}` | Detalhes do produto com grupos de opções |

### Pedidos (CLIENT)

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/v1/client/orders` | Criar novo pedido |

### Admin

| Método | Endpoint | Descrição |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/v1/admin/**` | CRUD completo (requer ROLE_ADMIN) |

---

## Funcionalidades

- **Cardápio público** com filtro por categoria e busca
- **Modal de pedido** com grupos de opções (radios e checkboxes com limites configuráveis)
- **Carrinho de compras** com edição de itens e observações
- **Autenticação segura** via cookies HttpOnly (access + refresh token)
- **Perfil do usuário** com dados pessoais e endereços
- **Histórico de pedidos** com status em tempo real
- **Painel administrativo** (login separado, rota protegida por `ROLE_ADMIN`)
- **Internacionalização (i18n)** em PT-BR, English e Español
- **Tema escuro/claro** persistente
- **Responsivo** para mobile e desktop

---

## Implementações Futuras

| Fase | Descrição | Status |
|---|---|---|
| **Fase 2** | Dashboard administrativo completo — CRUD de produtos, gerenciamento de pedidos, upload de imagens | ⬜ Pendente |
| **Fase 3** | Integração com gateway de pagamento (Stripe ou Mercado Pago) | ⬜ Pendente |
| **Fase 4** | Notificações em tempo real via WebSocket (atualização de status do pedido) | ⬜ Pendente |
| **Fase 5** | Fluxo de cadastro e recuperação de senha totalmente funcional | ⬜ Pendente |
| **Fase 6** | Gerenciamento de endereços com integração de CEP automático (ViaCEP) | ⬜ Pendente |
| **Fase 7** | Aplicativo mobile (React Native ou PWA) | ⬜ Pendente |
| **Fase 8** | Deploy em cloud (Docker + CI/CD via GitHub Actions) | ⬜ Pendente |

---

## Contribuindo

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir com este projeto.

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.
