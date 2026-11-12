import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { buildContent } from '@/test/fixtures';
import { isFavoriteOnServer, seedContents } from '@/test/mockApi';
import { renderApp } from '@/test/renderApp';

const MAX_TABS = 20;

async function tabUntilFocused(user: UserEvent, element: HTMLElement) {
  for (let i = 0; i < MAX_TABS && document.activeElement !== element; i++) {
    await user.tab();
  }
  expect(element).toHaveFocus();
}

beforeEach(() => {
  seedContents([
    buildContent({ id: 1, title: 'Meditação para iniciantes', category: 'meditacao' }),
    buildContent({ id: 2, title: 'Yoga matinal', category: 'yoga' }),
  ]);
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

    await tabUntilFocused(user, screen.getByRole('button', { name: 'Favoritar' }));
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument();
    expect(isFavoriteOnServer(2)).toBe(true);
  });
});
