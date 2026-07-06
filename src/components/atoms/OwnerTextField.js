import { TextField } from '@mui/material'

export default function OwnerTextField ({ onChange, disabled, error }) {
  return (
    <TextField
      id="owner-input"
      label="Address"
      name="owner"
      size="small"
      fullWidth
      required={!disabled}
      margin="dense"
      type="text"
      inputProps={{ step: 'any' }}
      disabled={disabled}
      onChange={onChange}
      error={error}
      sx={{ margin: '0' }}
    />
  )
}
