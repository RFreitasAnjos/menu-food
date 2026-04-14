# Contribuindo com o MenuFood

Obrigado por considerar contribuir! Este documento descreve o processo para colaborar com o projeto de forma organizada.

---

## Sumário

- [Código de Conduta](#código-de-conduta)
- [Como Reportar um Bug](#como-reportar-um-bug)
- [Como Sugerir uma Funcionalidade](#como-sugerir-uma-funcionalidade)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Fluxo de Trabalho com Git](#fluxo-de-trabalho-com-git)
- [Convenções de Commit](#convenções-de-commit)
- [Padrões de Código](#padrões-de-código)
- [Abrindo um Pull Request](#abrindo-um-pull-request)

---

## Código de Conduta

Seja respeitoso e construtivo nas interações. Não serão tolerados comentários ofensivos, discriminatórios ou spam.

---

## Como Reportar um Bug

1. Verifique se o bug já foi reportado nas [Issues](../../issues).
2. Se não, abra uma nova issue usando o template **Bug Report**.
3. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Versão do sistema operacional, Java, Node.js
   - Prints ou logs relevantes

---

## Como Sugerir uma Funcionalidade

1. Verifique se a funcionalidade já foi sugerida nas [Issues](../../issues).
2. Se não, abra uma nova issue usando o template **Feature Request**.
3. Explique o problema que a funcionalidade resolve e como você imagina a implementação.

---

## Configuração do Ambiente

Consulte o [README.md](README.md#como-inicializar-o-projeto) para instruções completas de setup.

**Resumo rápido:**

```bash
# 1. Banco de dados
cd backend/api && docker compose up -d

# 2. Backend
mvn spring-boot:run

# 3. Frontend
cd ../../frontend && npm install && npm run dev
```

---

## Fluxo de Trabalho com Git

Este projeto adota o **GitHub Flow**:

1. Faça um **fork** do repositório (para contribuidores externos) ou crie uma branch a partir de `main`.
2. Crie uma branch com nome descritivo seguindo o padrão abaixo.
3. Faça commits pequenos e focados.
4. Abra um **Pull Request** para `main` quando o trabalho estiver pronto para revisão.

### Padrão de Nomes de Branch

```
<tipo>/<escopo-curto>
```

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs` | Apenas documentação |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção (deps, CI, configs) |

**Exemplos:**

```
feat/admin-product-crud
fix/order-modal-radio-disable
docs/update-readme
chore/upgrade-nextjs
```

---

## Convenções de Commit

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo opcional]

[rodapé opcional — BREAKING CHANGE, refs #issue]
```

**Exemplos:**

```
feat(auth): add HttpOnly cookie-based refresh token flow
fix(order-modal): allow radio group option swap when max selection reached
docs(readme): add environment variables section
chore(deps): upgrade Spring Boot to 3.5.x
refactor(cart): extract item total calculation to utility function
```

**Regras:**
- Use o imperativo na descrição: _"add"_, _"fix"_, _"update"_ — não _"added"_, _"fixed"_
- Limite a primeira linha a 72 caracteres
- Referencie issues relacionadas no rodapé: `Closes #42`

---

## Padrões de Código

### Backend (Java)

- Siga os princípios da **Clean Architecture** — não adicione lógica de negócio nos controllers
- Use **Lombok** (`@Data`, `@Builder`, etc.) para reduzir boilerplate
- Use **DTOs** para todas as entradas e saídas dos controllers — nunca exponha entidades diretamente
- Valide entradas com **Bean Validation** (`@NotNull`, `@NotBlank`, `@Valid`)
- Nomes de classes em PascalCase, métodos e variáveis em camelCase
- Escreva testes unitários para use cases com JUnit 5 e Mockito

### Frontend (TypeScript / React)

- Use **TypeScript** estrito — evite `any`
- Componentes funcionais com hooks — sem class components
- Estilos exclusivamente via **Tailwind CSS** — sem CSS inline e sem arquivos `.module.css` novos
- Textos visíveis ao usuário usam o sistema de **i18n** (`useLanguage()`) — sem strings hardcoded
- Consulte o contexto adequado para estado global (`AuthContext`, `CartContext`, `ThemeContext`, `LanguageContext`)
- Execute `npm run lint` antes de abrir o PR

---

## Abrindo um Pull Request

1. Certifique-se de que o código compila e não quebra funcionalidades existentes.
2. Rode o linter:
   ```bash
   # Frontend
   cd frontend && npm run lint
   ```
3. Preencha o template do PR descrevendo:
   - **O que** foi feito
   - **Por que** foi feito
   - **Como testar**
   - Issues relacionadas
4. Solicite revisão de pelo menos um colaborador.
5. Após aprovação, o PR será mergeado via **Squash and Merge** para manter o histórico limpo.

---

Dúvidas? Abra uma [Discussion](../../discussions) ou uma issue com a label `question`.
