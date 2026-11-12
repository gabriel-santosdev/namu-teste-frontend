# Namu · Conteúdos de bem-estar

Teste técnico de front-end da Namu: uma biblioteca de conteúdos de bem-estar com catálogo, detalhe e favoritos, feita na web e no mobile, as duas usando a mesma API.

- **Web:** https://namu-teste-frontend-web.vercel.app ([como rodar](web/README.md))
- **Mobile:** APK na [página de releases](https://github.com/gabriel-santosdev/namu-teste-frontend/releases/latest) ([como rodar](mobile/README.md))

Nos dois casos, **a API precisa estar rodando na sua máquina**.

## Estrutura

```
packages/shared   tipos, cliente da API e formatações usados pela web e pelo mobile
web               React + Vite
mobile            React Native
docs              imagens da documentação
```

## API

A API vem do [repositório do teste](https://github.com/sioux1to1/teste-frontend-react-react-native-namu). Clone ele em outra pasta e rode (precisa de Docker):

```bash
cp .env.example .env
docker compose up -d
```

Ela sobe em `http://localhost:3333`.

## Scripts

Na raiz, com Node 22.11+:

```bash
npm install          # instala web e shared
npm run dev:web      # sobe a web
npm run typecheck    # checa os tipos
npm run lint         # ESLint
npm run format       # Prettier
npm test             # testes
```

O [CI](.github/workflows/ci.yml) roda lint, formatação, tipos e testes a cada push e pull request.
