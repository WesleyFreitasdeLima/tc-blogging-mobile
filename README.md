# 🚀 TC Blogging Mobile

Aplicativo mobile para o sistema de blog, desenvolvido como parte do Tech Challenge da FIAP. Construído com **React Native**, **TypeScript** e **Expo (Expo Router)**, consumindo a API REST do [tc-blogging-backend](https://github.com/WesleyFreitasdeLima/tc-blogging-backend).

## Arquitetura do Sistema

A aplicação adota uma arquitetura em camadas focada em experiência mobile, separando as regras de negócio, dados e comunicação com a API (`shared`) da camada de apresentação e telas (`src/app`). 

O roteamento é gerenciado pelo **Expo Router**, que utiliza a abordagem de *file-based routing* com suporte a rotas públicas e rotas autenticadas para o painel administrativo. O gerenciamento de estado de autenticação é centralizado via Context API (`AuthContext`), com persistência de token seguro via `Expo SecureStore`, e a construção de formulários utiliza `React Hook Form` com validação de esquemas via `Zod`.

### Tecnologias Principais

- **React Native**: Framework para construção de interfaces nativas para Android, iOS e Web a partir de uma única base de código.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática e segurança em tempo de compilação.
- **Expo & Expo Router**: Plataforma completa para desenvolvimento React Native e gerenciamento de navegação baseada em arquivos (*file-based routing*).
- **Axios**: Cliente HTTP para comunicação com a API REST, com interceptores para injeção automática de token JWT e tratamento de requisições.
- **Expo SecureStore**: Armazenamento criptografado nativo no dispositivo (Keychain no iOS e KeyStore com SharedPreferences no Android) para persistência segura de tokens JWT.
- **React Hook Form + Zod**: Criação, controle e validação de formulários com tipagem inferida e tratamento de erros amigável.
- **Lucide React Native**: Biblioteca moderna de ícones vetoriais personalizáveis.
- **React Native Safe Area Context**: Controle de áreas seguras da tela (*notches*, ilhas dinâmicas e barras de status/navegação).
- **React Native Gesture Handler & Reanimated**: Manipulação de gestos de alta performance e animações fluidas.

### Estrutura do Projeto

A estrutura de pastas organiza o projeto separando a infraestrutura e serviços compartilhados da camada de visualização e navegação:

```bash
tc-blogging-mobile/
├── assets/                 # Ícones, splash screens e recursos estáticos
├── src/
│   ├── app/                # Rotas e telas do Expo Router (file-based routing)
│   │   ├── _layout.tsx     # Layout raiz com AuthProvider e StatusBar
│   │   ├── index.tsx       # Tela inicial pública com artigos do blog
│   │   ├── auth/           # Módulo de autenticação (tela de login)
│   │   │   └── index.tsx
│   │   ├── posts/          # Visualização pública de artigos
│   │   │   └── [id].tsx
│   │   └── admin/          # Painel administrativo (rotas protegidas)
│   │       ├── _layout.tsx # Layout administrativo com menu de navegação
│   │       ├── index.tsx   # Visão geral / Dashboard do painel
│   │       ├── posts/      # Gestão de publicações (Visão Docente - CRUD)
│   │       │   ├── index.tsx
│   │       │   ├── create/
│   │       │   └── [id]/   # Edição e exclusão de posts
│   │       ├── teachers/   # Gestão de professores (Visão Administrador)
│   │       └── students/   # Gestão de alunos
│   ├── components/         # Componentes visuais e de navegação reutilizáveis
│   ├── shared/             # Camada de lógica, serviços e dados compartilhados
│   │   ├── contexts/       # Contextos globais (AuthContext)
│   │   ├── services/       # Clientes de API (api, auth.service, posts.service, token-storage)
│   │   └── types/          # Definições de tipos TypeScript (auth, post)
│   └── data/               # Dados locais, mocks e utilitários auxiliares
├── app.json                # Configuração do projeto Expo
├── package.json
└── tsconfig.json
```

## Configuração de Ambiente

1. Crie um arquivo `.env` na raiz do projeto.
2. Copie o modelo abaixo e preencha com a URL do backend:

```env
# URL base da API Backend (deve possuir o prefixo EXPO_PUBLIC_ para acesso client-side no Expo)
EXPO_PUBLIC_API_URL=https://tc-blogging-backend.onrender.com/api
```

> **⚠️ Aviso de Segurança:**
>
> - Não exponha dados sensíveis ou chaves privadas no `.env` do aplicativo móvel. No Expo, variáveis prefixadas com `EXPO_PUBLIC_` são embutidas no pacote final do aplicativo (*client-side*).
> - Certifique-se de que a variável `EXPO_PUBLIC_API_URL` aponte para a instância correta do backend (local ou de produção).

## Como Executar

### Pré-Requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Um dispositivo físico com o aplicativo **Expo Go** instalado (Android ou iOS) ou um emulador/simulador configurado ([Android Studio](https://developer.android.com/studio) ou [Xcode](https://developer.apple.com/xcode/)).

Certifique-se também de que o backend da aplicação esteja em execução:

```
https://github.com/WesleyFreitasdeLima/tc-blogging-backend
```

### Ambiente de Desenvolvimento (Local)

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/WesleyFreitasdeLima/tc-blogging-mobile.git
   ```

2. **Acessar a pasta do projeto:**
   ```bash
   cd tc-blogging-mobile
   ```

3. **Instalar as dependências:**
   ```bash
   npm install
   ```

4. **Configurar o arquivo `.env`** conforme a seção [Configuração de Ambiente](#configuração-de-ambiente).

5. **Iniciar o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

6. **Abrir a aplicação:**
   - **Dispositivo Físico:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.
   - **Android Emulator:** Pressione a tecla `a` no terminal.
   - **iOS Simulator:** Pressione a tecla `i` no terminal (apenas no macOS).
   - **Web:** Pressione a tecla `w` no terminal para abrir no navegador.

## Scripts Disponíveis

- `npm start` ou `npx expo start`: Inicia o servidor de desenvolvimento do Expo.
- `npm run android`: Inicia o app diretamente no emulador ou dispositivo Android conectado.
- `npm run ios`: Inicia o app no simulador iOS (disponível no macOS).
- `npm run web`: Inicia o app para testes no navegador web.
- `npm run lint`: Executa a verificação estática de código com o linter do Expo.
- `npx tsc --noEmit`: Executa a verificação estática de tipos com o compilador TypeScript.

## Funcionalidades e Rotas

A aplicação consome a API REST para gerenciamento de postagens, autenticação e administração da plataforma.

### Rotas Públicas

- `/`: Tela inicial com visualização dos artigos mais recentes do blog e acesso à tela de login.
- `/posts/[id]`: Visualização detalhada e leitura completa de uma publicação.
- `/auth`: Tela de login e autenticação com validação de campos.

### Rotas Autenticadas (Painel Administrativo)

- `/admin`: Dashboard inicial de navegação do painel.
- `/admin/posts`: Gestão de postagens (**Visão Docente**). Exibe a listagem com autor, data, suporte a recarregamento (*pull-to-refresh*) e ações rápidas.
- `/admin/posts/create`: Criação de uma nova publicação com título e conteúdo.
- `/admin/posts/[id]/edit`: Edição de informações e conteúdo de postagens existentes.
- `/admin/posts/[id]/delete`: Confirmação segura e conclusão de exclusão de postagem.
- `/admin/teachers`: Gestão da equipe de professores (listar, cadastrar, editar e remover docentes).
- `/admin/students`: Gestão acadêmica de alunos cadastrados.

### Autenticação e Segurança

- **Login e Sessão**: O login é realizado em `/auth` com usuário/e-mail e senha. A API retorna o token JWT e as informações do usuário.
- **Armazenamento Seguro**: O token JWT é persistido de forma protegida e criptografada utilizando o `Expo SecureStore`.
- **Interceptors**: Todas as requisições autenticadas incluem o cabeçalho `Authorization: Bearer <TOKEN>` automaticamente.
- **Perfis de Usuário**: Suporte a controle de acesso por papéis (`ADMIN` e `TEACHER`), garantindo que apenas usuários autorizados realizem operações de edição e exclusão.

## Relato de Experiências e Desafios

Durante o desenvolvimento do aplicativo mobile, a equipe superou desafios específicos do ecossistema móvel:

- **Divisão de tarefas e Git**: O trabalho colaborativo foi estruturado por meio de branchs organizadas e controle de versão com Git, garantindo que as implementações fossem revisadas, testadas e integradas de maneira incremental.
- **Autenticação Segura em Dispositivos Móveis**: A substituição do armazenamento simples (*localStorage*) pelo `Expo SecureStore` foi fundamental para garantir que tokens JWT fossem guardados utilizando os módulos de segurança nativos de cada sistema operacional (iOS Keychain e Android KeyStore).
- **Variáveis de Ambiente no Expo**: A adaptação das variáveis de ambiente para a convenção `EXPO_PUBLIC_` assegurou a correta injeção dos endereços da API tanto no desenvolvimento local quanto na execução em dispositivos reais.
- **Consistência Visual e Usabilidade Mobile**: O desenvolvimento das telas de administração (Visão Docente de Posts e Gestão de Professores) priorizou áreas de toque adequadas, feedbacks imediatos em botões de ação, tratamento de teclado com `KeyboardAvoidingView` e suporte a gestos como *pull-to-refresh*.
- **Integração em Camadas**: A separação entre o cliente HTTP (`api.ts`), serviços especializados (`auth.service.ts`, `posts.service.ts`) e o contexto global (`AuthContext`) facilitou a manutenção, o reaproveitamento de código e a tipagem estrita com TypeScript em todo o ciclo de vida da aplicação.

## Autores

- **RM371918** - Carlos Eduardo Mendonça da Silva
- **RM371258** - Douglas Lacerda da Conceição
- **RM372690** - Henrique Paulucci Vieira
- **RM371313** - Paulo Henrique Lopes
- **RM372340** - Wesley Freitas de Lima
