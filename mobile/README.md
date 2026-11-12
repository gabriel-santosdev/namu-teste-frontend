# Namu · Mobile

Este é o app React Native da biblioteca de conteúdos de bem-estar da Namu. Ele compartilha com a web os tipos, o cliente da API e as formatações, tudo pelo pacote [`@namu/shared`](../packages/shared).

## Tecnologias

- TypeScript
- React Native 0.88
- React Navigation (native stack)
- TanStack Query
- Axios

## Funcionalidades

- Listagem de conteúdos com scroll infinito e pull-to-refresh
- Detalhe do conteúdo, com opção de favoritar e desfavoritar
- Tela de favoritos
- Estados de carregamento e erro
- Placeholder "Imagem não disponível" quando o conteúdo não tem imagem ou quando ela não carrega

## Quer só testar? Use o APK

Se você só quer ver o app funcionando, não precisa montar todo o ambiente React Native. Deixei um APK de debug na [página de releases](https://github.com/gabriel-santosdev/namu-teste-frontend/releases/latest), já com o JavaScript embutido, então ele roda sem o Metro.

1. Suba a API na sua máquina (o passo a passo está no [README da raiz](../README.md#api)).
2. Abra um emulador Android.
3. Arraste o `app-debug.apk` para a janela do emulador (ou rode `adb install app-debug.apk`).
4. Abra o app **NamuMobile**.

Um detalhe: o APK procura a API em `http://10.0.2.2:3333`. Esse é o endereço que o emulador usa para falar com o seu computador, então o APK funciona no emulador, mas não num celular de verdade. Se quiser testar num aparelho físico, dá uma olhada em [Endereço da API](#endereço-da-api).

Se algo não funcionar, seja na instalação, ao abrir o app ou ao conectar com a API, é só me chamar. Fico à disposição para ajudar a deixar tudo rodando e garantir que o teste possa ser validado.

Se precisar gerar o APK de novo, rode dentro de `mobile/`:

```bash
npm run android:apk
```

Ele vai aparecer em `android/app/build/outputs/apk/debug/app-debug.apk`.

## Como rodar

Antes de tudo, siga o guia [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) do React Native e deixe a API rodando (veja o [README da raiz](../README.md#api)).

O mobile tem as próprias dependências. Dentro de `mobile/`:

```bash
npm install
npm start
```

Com o Metro no ar, abra outro terminal e escolha onde rodar:

```bash
npm run android          # emulador Android
npm run android:device   # celular Android ligado no USB
npm run ios              # simulador iOS
```

No iOS, instale os pods na primeira vez e sempre que mexer em alguma dependência nativa:

```bash
bundle install
bundle exec pod install
```

## Endereço da API

Essa é uma pegadinha clássica do Android. Dentro do emulador, `localhost` é o próprio emulador, e não o seu computador. Então, se o app tentar acessar `localhost:3333`, ele não encontra a API. Para chegar ao computador, o emulador usa o endereço `10.0.2.2`.

Por isso o app já vem configurado assim em [src/config/env.ts](src/config/env.ts): usa `10.0.2.2` no Android e `localhost` no iOS, onde o simulador enxerga a máquina normalmente. No emulador ou no simulador, não precisa mudar nada.

Num aparelho físico, troque o `API_HOST` nesse mesmo arquivo:

- **Celular no USB:** use `localhost` e rode com `npm run android:device`. Esse script faz um `adb reverse` da porta 3333, que redireciona o `localhost` do celular para o seu computador.
- **Celular no Wi-Fi:** use o IP do seu computador na rede, por exemplo:

  ```ts
  const API_HOST = '192.168.0.10';
  ```

  Nesse caso, a API também precisa aceitar conexões de fora da máquina, e o firewall precisa liberar a porta 3333.

Depois de trocar, é só recarregar o app (tecla `r` no terminal do Metro). Se for usar o APK, gere um novo com `npm run android:apk`, porque o endereço fica fixo dentro dele.

## Imagens que não carregam

Assim como na web, alguns conteúdos aparecem com o placeholder "Imagem não disponível" mesmo tendo imagem cadastrada. A culpa não é do app. As `thumbnailUrl` que a API devolve apontam para o [picsum.photos](https://picsum.photos), que anda instável e responde com **erro 522 (Connection timed out)** do Cloudflare. Quando o `Image` do React Native não consegue baixar a imagem, o `ContentThumbnail` mostra o placeholder no lugar.

![Erro 522 do Cloudflare ao abrir picsum.photos/seed/namu-11/640/360](../docs/picsum-erro-522.png)

Os testes que fiz e o motivo de não ter colocado retentativa automática estão no [README da web](../web/README.md#imagens-que-não-carregam).
