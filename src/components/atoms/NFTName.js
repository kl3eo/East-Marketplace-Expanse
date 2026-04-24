import { Typography } from '@mui/material'

export default function NFTName ({ name, variant }) {
  return (
    <Typography
      gutterBottom
      variant={variant}
      component="div"
      >
        {name}
    </Typography>
  )
}
