import { act, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { buildContent, paginate } from '@/test/fixtures';
import { apiUrl, errorResponse, seedContents } from '@/test/mockApi';
import { renderApp } from '@/test/renderApp';
import { findRequests, lastContentsQuery, server } from '@/test/server';

const contents = [
  buildContent({ id: 1, title: 'Meditação para iniciantes', category: 'meditacao' }),
  buildContent({ id: 2, title: 'Yoga matinal', category: 'yoga', type: 'video' }),
];

beforeEach(() => {
  seedContents(contents);
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

    await user.type(screen.getByRole('textbox', { name: 'Buscar por título' }), 'yoga{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Resultados para “yoga”' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('1 conteúdo')).toBeInTheDocument();
    expect(lastContentsQuery()?.get('search')).toBe('yoga');
    expect(lastContentsQuery()?.get('page')).toBe('1');
  });

  it('volta para a primeira página ao fazer uma nova busca', async () => {
    seedContents(
      Array.from({ length: 12 }, (_, index) =>
        buildContent({ id: index + 1, title: `Yoga ${index + 1}`, category: 'yoga' }),
      ),
    );
    const { user } = renderApp('/?pagina=2');
    await screen.findByRole('link', { name: /Yoga 11/ });
    expect(lastContentsQuery()?.get('page')).toBe('2');

    await user.type(screen.getByRole('textbox', { name: 'Buscar por título' }), 'yoga{Enter}');

    expect(await screen.findByRole('link', { name: /Yoga 1\b/ })).toBeInTheDocument();
    expect(lastContentsQuery()?.get('page')).toBe('1');
    expect(lastContentsQuery()?.get('search')).toBe('yoga');
  });

  it('filtra por categoria ao clicar no chip', async () => {
    const { user } = renderApp();
    const filters = await screen.findByRole('group', { name: 'Filtrar por categoria' });

    await user.click(await within(filters).findByRole('button', { name: 'Yoga' }));

    expect(within(filters).getByRole('button', { name: 'Yoga' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(await screen.findByText('1 conteúdo')).toBeInTheDocument();
    expect(lastContentsQuery()?.get('category')).toBe('yoga');
  });

  it('mostra estado vazio e permite limpar os filtros', async () => {
    const { user } = renderApp('/?busca=inexistente');

    expect(await screen.findByText('Nenhum conteúdo encontrado')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ver todos os conteúdos' }));

    expect(await screen.findByRole('heading', { name: 'Todos os conteúdos' })).toBeInTheDocument();
    expect(await screen.findByText('2 conteúdos')).toBeInTheDocument();
  });

  it('mostra estado vazio ao filtrar por uma categoria sem conteúdos', async () => {
    renderApp('/?categoria=sono');

    expect(await screen.findByText('Nenhum conteúdo encontrado')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Sono' })).toBeInTheDocument();
    expect(screen.getByText('0 conteúdos')).toBeInTheDocument();
  });

  it('mostra um placeholder quando o conteúdo não tem imagem', async () => {
    seedContents([buildContent({ id: 7, title: 'Yoga restaurativa', thumbnailUrl: null })]);
    renderApp();

    const card = (await screen.findByRole('link', { name: /Yoga restaurativa/ })).closest('li')!;
    expect(within(card).getByTestId('thumbnail-placeholder')).toBeInTheDocument();
    expect(card.querySelector('img')).toBeNull();
  });

  it('descarta a resposta de uma busca antiga que chega depois da nova', async () => {
    let releaseStale: () => void = () => {};
    const staleResponseGate = new Promise<void>((resolve) => (releaseStale = resolve));
    server.use(
      http.get(apiUrl('/contents'), async ({ request }) => {
        if (new URL(request.url).searchParams.get('search') !== 'med') return undefined;
        await staleResponseGate;
        return HttpResponse.json(paginate([contents[0]]));
      }),
    );
    const { user } = renderApp();
    await screen.findByText('2 conteúdos');

    const input = screen.getByRole('textbox', { name: 'Buscar por título' });
    await user.type(input, 'med{Enter}');
    await user.clear(input);
    await user.type(input, 'yoga{Enter}');

    expect(await screen.findByText('1 conteúdo')).toBeInTheDocument();

    await act(async () => releaseStale());

    expect(screen.getByRole('link', { name: /Yoga matinal/ })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Meditação para iniciantes/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('1 conteúdo')).toBeInTheDocument();
  });

  it('mostra erro e recarrega ao clicar em tentar novamente', async () => {
    server.use(
      http.get(apiUrl('/contents'), () => errorResponse(500, 'Servidor indisponível'), {
        once: true,
      }),
    );
    const { user } = renderApp();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Servidor indisponível');

    await user.click(within(alert).getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('2 conteúdos')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mostra mensagem de conexão quando a rede falha', async () => {
    server.use(http.get(apiUrl('/contents'), () => HttpResponse.error(), { once: true }));
    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao servidor',
    );
  });

  it('navega para o detalhe ao clicar em um card', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('link', { name: /Yoga matinal/ }));

    expect(
      await screen.findByRole('heading', { name: 'Yoga matinal', level: 1 }),
    ).toBeInTheDocument();
    expect(findRequests('GET', '/contents/2')).toHaveLength(1);
  });
});
