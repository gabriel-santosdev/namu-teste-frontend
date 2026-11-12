# Namu · Conteúdos de bem-estar

Teste técnico de Front-end da Namu: biblioteca de conteúdos de bem-estar com catálogo, detalhe e favoritos, disponível na web e no mobile consumindo a mesma API.

## Estrutura

```
packages/shared   tipos, cliente da API e formatações usados pela web e pelo mobile
web               aplicação React + Vite
mobile            app React Native
docs              imagens usadas na documentação
```

Cada aplicação tem o próprio README com funcionalidades, como rodar e observações:

- [Web](web/README.md)
- [Mobile](mobile/README.md)

## Pré-requisitos

- Node 22.11+
- Docker, para subir a API

## API

A API vem do [repositório do teste](https://github.com/sioux1to1/teste-frontend-react-react-native-namu) e fica em um clone separado deste projeto. Nele:

```bash
cp .env.example .env
docker compose up -d
```

Ela fica disponível em `http://localhost:3333`.

## Scripts da raiz

```bash
npm install          # instala web e shared
npm run dev:web      # sobe a web
npm run typecheck    # checagem de tipos (shared + web)
npm run lint         # ESLint
npm run format       # Prettier
npm test             # testes (shared + web)
```

O CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) roda lint, formatação, tipos e testes a cada push na `main` e em pull requests.
