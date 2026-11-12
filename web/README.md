# Namu · Web

Versão web da biblioteca de conteúdos de bem-estar da Namu.

## Tecnologias

- TypeScript
- React 19 + Vite
- React Router
- TanStack Query
- Axios
- Material UI + Tailwind CSS
- Jest + React Testing Library

## Funcionalidades

- Catálogo paginado com busca por título e filtro por categoria
- Detalhe do conteúdo em `/conteudos/:id`
- Favoritar e desfavoritar com atualização otimista
- Estados de carregamento, vazio e erro
- Placeholder "Imagem não disponível" para conteúdo sem imagem ou com imagem que falhou
- Layout responsivo e navegação por teclado

## Como rodar

Com a API rodando (veja o [README da raiz](../README.md#api)), na raiz do projeto:

```bash
npm install
cp web/.env.example web/.env
npm run dev:web
```

A web abre em `http://localhost:5173` e usa a API em `http://localhost:3333` (configurável em `VITE_API_URL`).

## Scripts

Rodados a partir da raiz:

```bash
npm run dev:web      # desenvolvimento
npm run build:web    # build de produção
npm run typecheck    # checagem de tipos
npm run lint         # ESLint
npm test             # testes (shared + web)
```

## Testes

Jest + React Testing Library, com a API mockada. Cobrem os fluxos principais:

- **Catálogo**: listagem, busca, filtro por categoria, estado vazio (inclusive categoria sem conteúdo), placeholder para conteúdo sem imagem, descarte de respostas antigas da busca, erro com "tentar novamente" e navegação para o detalhe
- **Detalhe**: exibição, favoritar/desfavoritar, rollback com erro ao favoritar, 409 de favorito duplicado, clique duplo rápido, erro 500 com "tentar novamente", placeholder sem imagem, 404 e id inválido
- **Teclado**: link "Pular para o conteúdo" e fluxo completo (buscar, abrir detalhe e favoritar) sem mouse
- **Shared**: formatações (incluindo durações extremas como 45 s e 1 h 2 min), mensagens de erro e política de retry

![Testes da web passando](../docs/testes-web.png)

## Imagens que não carregam

Alguns conteúdos podem aparecer com o placeholder "Imagem não disponível" mesmo tendo imagem cadastrada, e o conjunto muda a cada recarga da página. Isso não é um problema do front: as `thumbnailUrl` devolvidas pela API apontam para o [picsum.photos](https://picsum.photos), que está instável.

Ao abrir uma dessas URLs direto no navegador, o Cloudflare responde com **erro 522 (Connection timed out)**: o navegador e o Cloudflare estão funcionando, mas o servidor de origem do picsum não responde.

![Erro 522 do Cloudflare ao abrir picsum.photos/seed/namu-11/640/360](../docs/picsum-erro-522.png)

Nos testes feitos em 12/11/2026, todas as 21 imagens do picsum deram timeout depois de 20s, e o CDN dele (`fastly.picsum.photos`) respondeu com 503. Quando a requisição falha, o componente `ContentThumbnail` mostra o placeholder no lugar da imagem quebrada. Os conteúdos que vêm com `thumbnailUrl: null` mostram o placeholder sempre, e isso é esperado.

Uma retentativa automática no front chegou a ser testada, mas foi descartada: como cada tentativa leva cerca de 20s para falhar, o card ficava em branco por quase um minuto antes de mostrar o placeholder. A solução definitiva é a API servir as imagens a partir de uma fonte estável.

O [app mobile](../mobile/README.md#imagens-que-não-carregam) consome as mesmas URLs e tem o mesmo problema.
