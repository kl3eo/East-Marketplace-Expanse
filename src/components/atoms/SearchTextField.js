import { TextField } from '@mui/material'
import { isMobile } from 'react-device-detect'

export default function SearchTextField ({ onChange }) {
  return (
    <TextField
      id="search-input"
      label=""
      name="search"
      placeholder="find"
      size="small"
      fullWidth
      margin="dense"
      type="text"
      inputProps={{ step: 'any' }}
      onChange={onChange}
      sx={{ margin: '0', padding: '3px', width: isMobile ? '180px' : '120px', color: '#222222', backgroundColor: '#eeeeee' }}
    />
  )
}
