# Namu · Web

A versão web da biblioteca de conteúdos, feita com React 19, Vite, TypeScript, React Router, TanStack Query, Material UI e Tailwind.

## O que tem

- Catálogo paginado com busca por título e filtro por categoria
- Página de detalhe, com favoritar e desfavoritar. O botão muda na hora e volta ao estado anterior se a API falhar.
- Telas de carregamento, lista vazia e erro
- Layout responsivo e navegação pelo teclado

## Versão online

**https://namu-teste-frontend-web.vercel.app**

> **A API precisa estar rodando na sua máquina.** Só o front está publicado, e ele busca os dados em `http://localhost:3333`. Sem a API, a página abre, mas mostra erro. Veja [como subir a API](../README.md#api).

No Chrome e no Edge, pode aparecer um pedido para o site acessar a rede local. É só clicar em **Permitir**. O Safari bloqueia essa chamada, então nele é melhor rodar localmente.

Se algo não funcionar, é só me chamar que eu ajudo.

## Como rodar

Com a API no ar, na raiz do projeto:

```bash
npm install
cp web/.env.example web/.env
npm run dev:web
```

Abre em `http://localhost:5173`. Para usar outro endereço de API, troque o `VITE_API_URL` no `.env`.

## Por que o 409 não desfaz o favorito

Quando você favorita algo que já estava nos favoritos (por exemplo, em outra aba), a API responde 409. Nesse caso eu não desfaço o clique, porque o conteúdo já está favoritado e o botão está mostrando a verdade. Desfazer deixaria a tela errada. Depois de qualquer resposta, o app busca os dados de novo para garantir que tudo bate com a API. O mesmo vale para o 404 ao remover um favorito que já tinha sido removido.

Se o erro for outro (falha de rede, erro 500), aí sim o botão volta ao que era e aparece uma mensagem.

## Testes

Rode `npm test` na raiz. Os testes usam Jest, React Testing Library e [MSW](https://mswjs.io), que intercepta as chamadas HTTP e responde como a API de verdade, guardando os favoritos em memória. Assim, o app roda inteiro nos testes, do clique até a requisição, sem precisar da API no ar.

Eles cobrem o catálogo, a busca, o detalhe, os favoritos (inclusive com erro 500, queda de rede e 409) e o uso só pelo teclado.

![Testes da web passando](../docs/testes-web.png)

## Imagens que não carregam

Alguns cards podem mostrar "Imagem não disponível" mesmo tendo imagem. Não é bug do front: as imagens vêm do [picsum.photos](https://picsum.photos), que está fora do ar e responde com erro 522.

![Erro 522 do Cloudflare ao abrir picsum.photos/seed/namu-11/640/360](../docs/picsum-erro-522.png)

Quando a imagem falha, o app mostra o placeholder no lugar. Cheguei a testar tentar de novo automaticamente, mas cada tentativa levava uns 20 segundos para falhar e o card ficava em branco por quase um minuto, então desisti. O ideal é a API usar outra fonte de imagens.
