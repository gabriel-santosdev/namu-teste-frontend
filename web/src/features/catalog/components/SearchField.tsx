import CloseRounded from '@mui/icons-material/CloseRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

const SEARCH_DEBOUNCE_MS = 400;

interface SearchFieldProps {
  value: string;
  onSearch: (search: string) => void;
}

export function SearchField({ value, onSearch }: SearchFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const { debounced: debouncedSearch, cancel } = useDebouncedCallback(onSearch, SEARCH_DEBOUNCE_MS);

  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== inputValue.trim()) setInputValue(value);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSearch(event.target.value.trim());
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    cancel();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    cancel();
    setInputValue('');
    onSearch('');
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full md:max-w-sm">
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar por título…"
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            bgcolor: 'background.paper',
            pl: 1.5,
          },
          '& .MuiOutlinedInput-input': { py: 1.25 },
        }}
        slotProps={{
          htmlInput: { 'aria-label': 'Buscar por título', enterKeyHint: 'search' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded color="primary" />
              </InputAdornment>
            ),
            endAdornment: inputValue && (
              <InputAdornment position="end">
                <IconButton aria-label="Limpar busca" onClick={handleClear}>
                  <CloseRounded fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </form>
  );
}
