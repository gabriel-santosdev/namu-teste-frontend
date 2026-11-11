import { ApiError } from '@namu/shared';
import { screen, waitFor, within } from '@testing-library/react';
import { api } from '@/lib/api';
import { buildContentDetail, categories } from '@/test/fixtures';
import { renderApp } from '@/test/renderApp';

jest.mock('@/lib/api', () => jest.requireActual('@/test/apiMock'));

const mockedApi = jest.mocked(api);

const content = buildContentDetail({ id: 7, title: 'Respiração consciente' });

beforeEach(() => {
  jest.clearAllMocks();
  mockedApi.getCategories.mockResolvedValue(categories);
  mockedApi.getContent.mockResolvedValue(content);
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
    expect(mockedApi.getContent).toHaveBeenCalledWith(7, expect.anything());
  });

  it('favorita o conteúdo', async () => {
    mockedApi.addFavorite.mockResolvedValue(content);
    const { user } = renderApp('/conteudos/7');

    const button = await screen.findByRole('button', { name: 'Favoritar' });
    mockedApi.getContent.mockResolvedValue({ ...content, isFavorite: true });
    await user.click(button);

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(mockedApi.addFavorite).toHaveBeenCalledWith(7);
  });

  it('remove dos favoritos', async () => {
    mockedApi.getContent.mockResolvedValue({ ...content, isFavorite: true });
    mockedApi.removeFavorite.mockResolvedValue();
    const { user } = renderApp('/conteudos/7');

    const button = await screen.findByRole('button', { name: 'Remover dos favoritos' });
    mockedApi.getContent.mockResolvedValue(content);
    await user.click(button);

    expect(await screen.findByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
    expect(mockedApi.removeFavorite).toHaveBeenCalledWith(7);
  });

  it('desfaz o favorito e mostra erro quando a API falha', async () => {
    mockedApi.addFavorite.mockRejectedValue(new ApiError('Servidor indisponível', 500));
    const { user } = renderApp('/conteudos/7');

    await user.click(await screen.findByRole('button', { name: 'Favoritar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível favoritar. Servidor indisponível',
    );
    expect(screen.getByRole('button', { name: 'Favoritar' })).toBeInTheDocument();
  });

  it('trata o 409 de favorito duplicado como sucesso', async () => {
    mockedApi.addFavorite.mockRejectedValue(new ApiError('Conteúdo já está nos favoritos.', 409));
    const { user } = renderApp('/conteudos/7');

    const button = await screen.findByRole('button', { name: 'Favoritar' });
    mockedApi.getContent.mockResolvedValue({ ...content, isFavorite: true });
    await user.click(button);

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mantém o estado consistente com clique duplo rápido', async () => {
    mockedApi.addFavorite
      .mockResolvedValueOnce(content)
      .mockRejectedValueOnce(new ApiError('Conteúdo já está nos favoritos.', 409));
    const { user } = renderApp('/conteudos/7');

    const button = await screen.findByRole('button', { name: 'Favoritar' });
    mockedApi.getContent.mockResolvedValue({ ...content, isFavorite: true });
    await user.dblClick(button);

    await waitFor(() => expect(mockedApi.addFavorite).toHaveBeenCalledTimes(2));
    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(mockedApi.removeFavorite).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mostra erro amigável com opção de tentar novamente quando a API retorna 500', async () => {
    mockedApi.getContent.mockRejectedValueOnce(
      new ApiError('Erro interno ao carregar o conteúdo.', 500),
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
    mockedApi.getContent.mockResolvedValue({ ...content, thumbnailUrl: null });
    renderApp('/conteudos/7');

    await screen.findByRole('heading', { name: 'Respiração consciente', level: 1 });
    expect(screen.getByTestId('thumbnail-placeholder')).toBeInTheDocument();
    expect(screen.getByRole('article').querySelector('img')).toBeNull();
  });

  it('mostra conteúdo não encontrado quando a API retorna 404', async () => {
    mockedApi.getContent.mockRejectedValue(new ApiError('Conteúdo não encontrado', 404));
    renderApp('/conteudos/999');

    expect(await screen.findByText('Conteúdo não encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todos os conteúdos' })).toBeInTheDocument();
  });

  it('mostra conteúdo não encontrado sem chamar a API quando o id é inválido', () => {
    renderApp('/conteudos/abc');

    expect(screen.getByText('Conteúdo não encontrado')).toBeInTheDocument();
    expect(mockedApi.getContent).not.toHaveBeenCalled();
  });
});
