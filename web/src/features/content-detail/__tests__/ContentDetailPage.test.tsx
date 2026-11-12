import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { buildContent } from '@/test/fixtures';
import {
  apiUrl,
  errorResponse,
  isFavoriteOnServer,
  seedContents,
  seedFavorites,
} from '@/test/mockApi';
import { renderApp } from '@/test/renderApp';
import { findRequests, server } from '@/test/server';

beforeEach(() => {
  seedContents([buildContent({ id: 7, title: 'Respiração consciente' })]);
});

describe('ContentDetailPage', () => {
  it('mostra os detalhes do conteúdo', async () => {
    renderApp('/conteudos/7');

    expect(
      await screen.findByRole('heading', { name: 'Respiração consciente', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(await screen.findByText('Meditação')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
  });

  it('favorita o conteúdo', async () => {
    const { user } = renderApp('/conteudos/7');

    await user.click(await screen.findByRole('button', { name: 'Favoritar' }));

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(isFavoriteOnServer(7)).toBe(true);
  });

  it('remove dos favoritos', async () => {
    seedFavorites([7]);
    const { user } = renderApp('/conteudos/7');

    await user.click(await screen.findByRole('button', { name: 'Remover dos favoritos' }));

    expect(await screen.findByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
    expect(isFavoriteOnServer(7)).toBe(false);
  });

  it('desfaz o favorito e mostra erro quando a API falha', async () => {
    server.use(http.post(apiUrl('/favorites'), () => errorResponse(500, 'Servidor indisponível')));
    const { user } = renderApp('/conteudos/7');

    await user.click(await screen.findByRole('button', { name: 'Favoritar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível favoritar. Servidor indisponível',
    );
    expect(screen.getByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
    expect(isFavoriteOnServer(7)).toBe(false);
  });

  it('desfaz o favorito quando a rede cai', async () => {
    server.use(http.post(apiUrl('/favorites'), () => HttpResponse.error()));
    const { user } = renderApp('/conteudos/7');

    await user.click(await screen.findByRole('button', { name: 'Favoritar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao servidor',
    );
    expect(screen.getByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
  });

  it('trata o 409 de favorito duplicado como sucesso', async () => {
    const { user } = renderApp('/conteudos/7');
    const button = await screen.findByRole('button', { name: 'Favoritar' });

    seedFavorites([7]);
    await user.click(button);

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(findRequests('POST', '/favorites')).toHaveLength(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mantém o estado consistente com clique duplo rápido', async () => {
    const { user } = renderApp('/conteudos/7');

    await user.dblClick(await screen.findByRole('button', { name: 'Favoritar' }));

    await waitFor(() => expect(findRequests('POST', '/favorites')).toHaveLength(2));
    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(findRequests('DELETE', /^\/favorites\//)).toHaveLength(0);
    expect(isFavoriteOnServer(7)).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mostra erro amigável com opção de tentar novamente quando a API retorna 500', async () => {
    server.use(
      http.get(
        apiUrl('/contents/:id'),
        () => errorResponse(500, 'Erro interno ao carregar o conteúdo.'),
        { once: true },
      ),
    );
    const { user } = renderApp('/conteudos/7');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Não foi possível carregar o conteúdo');
    expect(alert).toHaveTextContent('Erro interno ao carregar o conteúdo.');

    await user.click(within(alert).getByRole('button', { name: 'Tentar novamente' }));

    expect(
      await screen.findByRole('heading', { name: 'Respiração consciente', level: 1 }),
    ).toBeInTheDocument();
  });

  it('mostra um placeholder quando o conteúdo não tem imagem', async () => {
    seedContents([buildContent({ id: 7, title: 'Respiração consciente', thumbnailUrl: null })]);
    renderApp('/conteudos/7');

    await screen.findByRole('heading', { name: 'Respiração consciente', level: 1 });
    expect(screen.getByTestId('thumbnail-placeholder')).toBeInTheDocument();
    expect(screen.getByRole('article').querySelector('img')).toBeNull();
  });

  it('mostra conteúdo não encontrado quando a API retorna 404', async () => {
    renderApp('/conteudos/999');

    expect(await screen.findByText('Conteúdo não encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todos os conteúdos' })).toBeInTheDocument();
  });

  it('mostra conteúdo não encontrado sem chamar a API quando o id é inválido', () => {
    renderApp('/conteudos/abc');

    expect(screen.getByText('Conteúdo não encontrado')).toBeInTheDocument();
    expect(findRequests('GET', /^\/contents\//)).toHaveLength(0);
  });
});
