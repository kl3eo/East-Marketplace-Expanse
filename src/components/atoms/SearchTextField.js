import { TextField } from '@mui/material'
import { isMobile } from 'react-device-detect'

export default function SearchTextField ({ onChange }) {
  return (
    <TextField
      id="searchInput"
      label=""
      name="search"
      placeholder="🔍"
      size="small"
      fullWidth
      margin="dense"
      type="text"
      inputProps={{ step: 'any' }}
      onChange={onChange}
      style={{ margin: '0', padding: isMobile ? '2px' : '3px', width: isMobile ? '180px' : '120px', color: '#222222', backgroundColor: '#eeeeee' }}
    />
  )
}
