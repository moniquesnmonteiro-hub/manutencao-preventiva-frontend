# PreventivaPIM — Frontend

Interface web do sistema de gestão de manutenção preventiva desenvolvido para o **Polo Industrial de Manaus (PIM)**.

---

## Tecnologias

| | |
|---|---|
| Framework | Angular 21 |
| Estilização | Tailwind CSS |
| Reatividade | Signals + Standalone Components |
| Formulários | Reactive Forms + Template-driven Forms |
| HTTP | HttpClient + Interceptor de autenticação |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Angular CLI](https://angular.io/cli) v17+
- Backend rodando em `http://localhost:3000`

---

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar a aplicação

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

---

## Estrutura

```
src/app/
├── core/
│   ├── services/       # Comunicação com a API (auth, equipamentos, planos, etc.)
│   ├── models/         # Interfaces e tipos TypeScript
│   ├── guards/         # Proteção de rotas (redireciona para login se não autenticado)
│   └── interceptors/   # Anexa o access token e renova a sessão automaticamente
├── features/
│   ├── auth/           # Tela de login
│   ├── dashboard/      # Indicadores e alertas de manutenções atrasadas
│   ├── equipamentos/   # Listagem e cadastro de equipamentos
│   ├── planos/         # Planos de manutenção e histórico de execuções
│   ├── execucoes/      # Formulário de registro de execução
│   ├── calendario/     # Visão cronológica com atribuição de técnicos
│   └── usuarios/       # Cadastro de novos usuários (apenas Gestor)
└── app.routes.ts       # Definição das rotas com lazy loading
```

---

## Rotas da aplicação

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/app/dashboard` | Dashboard | Autenticado |
| `/app/equipamentos` | Lista de equipamentos | Autenticado |
| `/app/planos` | Lista de planos | Autenticado |
| `/app/planos/:id` | Detalhe do plano + histórico | Autenticado |
| `/app/calendario` | Calendário de manutenções | Autenticado |
| `/app/execucoes/nova` | Registrar execução | Autenticado |
| `/app/usuarios/novo` | Cadastrar usuário | Gestor |

> Todas as rotas protegidas redirecionam para `/login` caso o usuário não esteja autenticado.

---

## Autenticação

O frontend gerencia dois tokens armazenados no `localStorage`:

- **access_token** — válido por 15 minutos, enviado em todas as requisições via header `Authorization: Bearer`
- **refresh_token** — válido por 7 dias, usado automaticamente para renovar o access token quando este expira

O interceptor (`auth.interceptor.ts`) captura respostas `401`, renova o token em background e reexecuta a requisição original — sem interromper o usuário.

---

## Perfis de acesso

| Perfil | Telas disponíveis |
|---|---|
| **Técnico** | Dashboard, Calendário, Planos, Registrar Execução |
| **Supervisor** | Tudo do Técnico + Equipamentos |
| **Gestor** | Tudo + Cadastrar Usuário + editar qualquer equipamento |

---

## Funcionalidades principais

- **Dashboard** com indicadores em tempo real: atrasos, conformidade do mês, próximas execuções e alertas com ação direta
- **Calendário interativo** com busca de técnico inline (debounce de 300ms) e atribuição sem sair da tela
- **Histórico de execuções** por plano com técnico responsável, status e conformidade
- **Edição de perfil** — qualquer usuário pode alterar seu nome e senha diretamente pelo menu lateral
- **Interface responsiva** — adaptada para desktop e dispositivos móveis

---

## Autor

Desenvolvido por **Monique** — Projeto Final INDT Educacional · 2026