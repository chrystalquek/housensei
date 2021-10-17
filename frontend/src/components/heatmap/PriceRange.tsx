import { useState } from 'react';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { useAppDispatch } from '../../app/hooks';

import { currencyFormatter } from '../../app/utils';

interface Props {
  priceRange: number;
  setHeatmapPriceRange: ActionCreatorWithPayload<number, string>;
}

const PriceRange = ({ priceRange, setHeatmapPriceRange }: Props) => {
  const dispatch = useAppDispatch();
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      setPriceRangeOpen(false);
    }
  };

  return priceRangeOpen ? (
    <TextField
      type="number"
      size="small"
      variant="outlined"
      value={priceRange}
      onChange={(event) =>
        dispatch(setHeatmapPriceRange(parseInt(event.target.value, 10)))
      }
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              mr: '4px',
              '.MuiTypography-root': (theme) => theme.typography.body2,
            }}
          >
            $
          </InputAdornment>
        ),
        onBlur: () => setPriceRangeOpen(false),
        onKeyDown: handleEnter,
        autoFocus: true,
        sx: {
          fontSize: (theme) => theme.typography.body2,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          px: 1,
          '.MuiInputBase-input': {
            maxWidth: 70,
            p: '3px 4px',
          },
        },
      }}
      sx={{
        p: '8px 0 4px',
      }}
    />
  ) : (
    <Stack direction="row" alignItems="center" sx={{ p: '8px 0 4px' }}>
      <Typography variant="subtitle2">
        {currencyFormatter.format(priceRange)}
      </Typography>
      <IconButton size="small" onClick={() => setPriceRangeOpen(true)}>
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};

export default PriceRange;