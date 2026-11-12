# Namu · Mobile

O app da biblioteca de conteúdos, feito com React Native 0.88, TypeScript, React Navigation e TanStack Query. Ele usa o mesmo pacote [`@namu/shared`](../packages/shared) da web.

## O que tem

- Lista de conteúdos com busca, scroll infinito e puxar para atualizar
- Detalhe do conteúdo, com favoritar e desfavoritar
- Tela de favoritos
- Telas de carregamento e erro

## Testar com o APK

O jeito mais rápido é baixar o `app-debug.apk` na [página de releases](https://github.com/gabriel-santosdev/namu-teste-frontend/releases/latest). Ele roda sozinho, sem precisar montar o ambiente React Native.

1. Suba a API na sua máquina ([veja como](../README.md#api)).
2. Abra um emulador Android.
3. Arraste o APK para a janela do emulador.
4. Abra o app **NamuMobile**.

O APK funciona no emulador, não num celular de verdade (o motivo está logo abaixo).

Se algo não funcionar, é só me chamar que eu ajudo.

## Endereço da API

No emulador Android, `localhost` aponta para o próprio emulador, não para o seu computador. Para chegar ao computador, o emulador usa `10.0.2.2`. Por isso o app usa `10.0.2.2` no Android e `localhost` no iOS.

Num celular de verdade, troque o `API_HOST` em [src/config/env.ts](src/config/env.ts):

- **No USB:** use `localhost` e rode com `npm run android:device`.
- **No Wi-Fi:** use o IP do seu computador, por exemplo `192.168.0.10`.

## Como rodar

Siga antes o [guia de ambiente do React Native](https://reactnative.dev/docs/set-up-your-environment). Depois, dentro de `mobile/`:

```bash
npm install
npm start
```

E em outro terminal:

```bash
npm run android          # emulador Android
npm run android:device   # celular no USB
npm run ios              # simulador iOS (rode antes: bundle install && bundle exec pod install)
```

Para gerar um APK novo, rode `npm run android:apk`. Ele aparece em `android/app/build/outputs/apk/debug/`.

## Imagens que não carregam

Assim como na web, alguns conteúdos mostram "Imagem não disponível" porque o [picsum.photos](https://picsum.photos), de onde vêm as imagens, está fora do ar. Mais detalhes no [README da web](../web/README.md#imagens-que-não-carregam).
