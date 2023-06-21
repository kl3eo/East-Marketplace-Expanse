import { Paper, Typography } from '@mui/material'

export default function LowOnBalanceTip () {
  return (
    <Paper
      elevation={3}
      square
      sx={{
        p: '5px 15px'
      }}>
      <Typography variant="body2" color="text.secondary">
        Low on Expanse? Use this <a href='https://wallet.room-house.com' target="_blank ">swap</a> to get coins!
      </Typography>
    </Paper>
  )
}
