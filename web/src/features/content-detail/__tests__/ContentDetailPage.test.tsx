import { ApiError } from '@namu/shared';
import { screen } from '@testing-library/react';
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
