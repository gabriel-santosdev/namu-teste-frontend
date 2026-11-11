import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from '../components/SearchField';

describe('SearchField', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('dispara a busca uma única vez após o debounce', async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchField value="" onSearch={onSearch} />);

    await user.type(screen.getByRole('textbox', { name: 'Buscar por título' }), '  yoga ');
    expect(onSearch).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(400));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('yoga');
  });

  it('limpa a busca ao clicar no botão de limpar', async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchField value="yoga" onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }));

    expect(onSearch).toHaveBeenCalledWith('');
    expect(screen.getByRole('textbox', { name: 'Buscar por título' })).toHaveValue('');
  });
});
