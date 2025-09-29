import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 
    
    if (query.trim()) {
      onSearch(query.trim());
      setQuery(''); 
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={styles.searchBarContainer}
    >
      <Paper
        elevation={1}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: { xs: 150, sm: 250, md: 300 },
          borderRadius: '20px',
          transition: 'width 0.3s',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar ciudad..."
          value={query}
          onChange={handleInputChange}
          inputProps={{ 'aria-label': 'buscar ciudad' }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;