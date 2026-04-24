import * as React from 'react'
// import Box from '@mui/material/Box'
// import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
// import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { setCateg, setLoading, setFullyLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'

export default function BasicSelect () {
  const [place, setPlace] = React.useState('')
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setPlace(e.target.value)
    dispatch(setCateg(e.target.value))
    dispatch(getData([]))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(setRelo(false))
    dispatch(setLoading(true))
    dispatch(setFullyLoaded(false))
  }

  return (
       <Select sx={{ minWidth: 120, backgroundColor: '#fff', marginRight: '8px', height: '40px', display: isMobile ? 'none' : 'block' }}
          labelId="select-label"
          id="select-id"
          value={place}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          onChange={handleChange}
        >
          <MenuItem value="Brooklyn">Brooklyn</MenuItem>
          <MenuItem value="Manhattan">Manhattan</MenuItem>
          <MenuItem value="Queens">Queens</MenuItem>
          <MenuItem value="Bronx">Bronx</MenuItem>
          <MenuItem value="">All boroughs</MenuItem>
        </Select>

  )
}
