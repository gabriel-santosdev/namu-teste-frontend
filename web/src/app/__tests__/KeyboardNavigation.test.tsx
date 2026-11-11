import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { api } from '@/lib/api';
import { buildContent, buildContentDetail, categories, paginate } from '@/test/fixtures';
import { renderApp } from '@/test/renderApp';

jest.mock('@/lib/api', () => jest.requireActual('@/test/apiMock'));

const mockedApi = jest.mocked(api);

const MAX_TABS = 20;

const contents = [
  buildContent({ id: 1, title: 'Meditação para iniciantes', category: 'meditacao' }),
  buildContent({ id: 2, title: 'Yoga matinal', category: 'yoga' }),
];

async function tabUntilFocused(user: UserEvent, element: HTMLElement) {
  for (let i = 0; i < MAX_TABS && document.activeElement !== element; i++) {
    await user.tab();
  }
  expect(element).toHaveFocus();
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedApi.getCategories.mockResolvedValue(categories);
  mockedApi.getContents.mockImplementation((query) =>
    Promise.resolve(paginate(query?.search === 'yoga' ? [contents[1]] : contents)),
  );
  mockedApi.getContent.mockResolvedValue(buildContentDetail({ id: 2, title: 'Yoga matinal' }));
  mockedApi.addFavorite.mockResolvedValue(contents[1]);
});

describe('Navegação por teclado', () => {
  it('pula o cabeçalho com o link de atalho', async () => {
    const { user } = renderApp();
    await screen.findByText('2 conteúdos');

    await user.tab();
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Buscar por título' })).toHaveFocus();
  });

  it('busca, abre o detalhe e favorita usando apenas o teclado', async () => {
    const { user } = renderApp();
    await screen.findByText('2 conteúdos');

    await tabUntilFocused(user, screen.getByRole('textbox', { name: 'Buscar por título' }));
    await user.keyboard('yoga{Enter}');
    await screen.findByText('1 conteúdo');

    await tabUntilFocused(user, screen.getByRole('link', { name: /Yoga matinal/ }));
    await user.keyboard('{Enter}');

    const heading = await screen.findByRole('heading', { name: 'Yoga matinal', level: 1 });
    expect(heading).toHaveFocus();

    mockedApi.getContent.mockResolvedValue(
      buildContentDetail({ id: 2, title: 'Yoga matinal', isFavorite: true }),
    );
    await tabUntilFocused(user, screen.getByRole('button', { name: 'Favoritar' }));
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(mockedApi.addFavorite).toHaveBeenCalledWith(2);
  });
});
