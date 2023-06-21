import { TextField } from '@mui/material'

export default function SearchTextField ({ onChange }) {
  return (
    <TextField
      id="search-input"
      label=""
      name="search"
      size="small"
      fullWidth
      margin="dense"
      type="text"
      inputProps={{ step: 'any' }}
      onChange={onChange}
      sx={{ margin: '0', width: '120px', color: '#222222', backgroundColor: '#eeeeee' }}
    />
  )
}
