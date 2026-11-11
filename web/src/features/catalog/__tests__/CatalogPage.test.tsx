import { ApiError } from '@namu/shared';
import { screen, within } from '@testing-library/react';
import { api } from '@/lib/api';
import { buildContent, buildContentDetail, categories, paginate } from '@/test/fixtures';
import { renderApp } from '@/test/renderApp';

jest.mock('@/lib/api', () => jest.requireActual('@/test/apiMock'));

const mockedApi = jest.mocked(api);

const contents = [
  buildContent({ id: 1, title: 'Meditação para iniciantes', category: 'meditacao' }),
  buildContent({ id: 2, title: 'Yoga matinal', category: 'yoga', type: 'video' }),
];

beforeEach(() => {
  jest.clearAllMocks();
  mockedApi.getCategories.mockResolvedValue(categories);
  mockedApi.getContents.mockResolvedValue(paginate(contents));
});

describe('CatalogPage', () => {
  it('lista os conteúdos retornados pela API', async () => {
    renderApp();

    expect(screen.getByRole('heading', { name: 'Conteúdos', level: 1 })).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: /Meditação para iniciantes/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Yoga matinal/ })).toBeInTheDocument();
    expect(screen.getByText('2 conteúdos')).toBeInTheDocument();
  });

  it('busca por título ao enviar o formulário', async () => {
    const { user } = renderApp();
    await screen.findByText('2 conteúdos');

    mockedApi.getContents.mockResolvedValue(paginate([contents[1]]));
    await user.type(screen.getByRole('textbox', { name: 'Buscar por título' }), 'yoga{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Resultados para “yoga”' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('1 conteúdo')).toBeInTheDocument();
    expect(mockedApi.getContents).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'yoga', page: 1 }),
      expect.anything(),
    );
  });

  it('filtra por categoria ao clicar no chip', async () => {
    const { user } = renderApp();
    const filters = await screen.findByRole('group', { name: 'Filtrar por categoria' });

    await user.click(await within(filters).findByRole('button', { name: 'Yoga' }));

    expect(within(filters).getByRole('button', { name: 'Yoga' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(mockedApi.getContents).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: 'yoga' }),
      expect.anything(),
    );
  });

  it('mostra estado vazio e permite limpar os filtros', async () => {
    mockedApi.getContents.mockResolvedValue(paginate([]));
    const { user } = renderApp('/?busca=inexistente');

    expect(await screen.findByText('Nenhum conteúdo encontrado')).toBeInTheDocument();

    mockedApi.getContents.mockResolvedValue(paginate(contents));
    await user.click(screen.getByRole('button', { name: 'Ver todos os conteúdos' }));

    expect(await screen.findByRole('heading', { name: 'Todos os conteúdos' })).toBeInTheDocument();
    expect(await screen.findByText('2 conteúdos')).toBeInTheDocument();
  });

  it('mostra erro e recarrega ao clicar em tentar novamente', async () => {
    mockedApi.getContents.mockRejectedValueOnce(new ApiError('Servidor indisponível', 500));
    const { user } = renderApp();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Servidor indisponível');

    await user.click(within(alert).getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('2 conteúdos')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('navega para o detalhe ao clicar em um card', async () => {
    mockedApi.getContent.mockResolvedValue(buildContentDetail({ id: 2, title: 'Yoga matinal' }));
    const { user } = renderApp();

    await user.click(await screen.findByRole('link', { name: /Yoga matinal/ }));

    expect(
      await screen.findByRole('heading', { name: 'Yoga matinal', level: 1 }),
    ).toBeInTheDocument();
    expect(mockedApi.getContent).toHaveBeenCalledWith(2, expect.anything());
  });
});
