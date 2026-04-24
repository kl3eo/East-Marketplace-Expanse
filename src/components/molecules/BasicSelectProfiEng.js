import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { setCateg, setLoading, setFullyLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { useState } from 'react'
import { store } from '../../../store/store'

export default function BasicSelectProfiEng () {
  // const [selectedList, setSelectedList] = useState([])
  const state = store.getState()
  const storedFilteredItemsList = state.storedFilteredItemsList
  const { categStr, fullyLoaded, loading } = storedFilteredItemsList
  const [place, setPlace] = useState(categStr)
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
  // console.log('eng categStr is', categStr)
  return (
       <Select sx={{ backgroundColor: '#fff', marginRight: '8px', height: '40px', display: isMobile ? 'block' : 'block' }}
          labelId="select-label"
          id="select-id"
          value={place}
          disabled={!fullyLoaded || loading}
          displayEmpty
          autoWidth
          inputProps={{ 'aria-label': 'Without label' }}
          onChange={handleChange}
        >
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === ''} value="">All Categories</MenuItem>
          <Divider>Onliners</Divider>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Tutor'} value="Tutor">Tutor</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Psychologist'} value="Psychologist">Psychologist</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Lawyer'} value="Lawyer">Lawyer</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Developer'} value="Developer">Developer</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Footballer'} value="Footballer">Footballer</MenuItem>
          <Divider>R-H Aparts</Divider>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Brooklyn'} value="Brooklyn">Brooklyn</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Manhattan'} value="Manhattan">Manhattan</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Queens'} value="Queens">Queens</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Bronx'} value="Bronx">Bronx</MenuItem>
          <Divider>Fine Arts</Divider>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Photo'} value="Photo">Photo</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Genre'} value="Genre">Genre</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Landscape'} value="Landscape">Landscape</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Cityscape'} value="Cityscape">Cityscape</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Seascape'} value="Seascape">Seascape</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Portrait'} value="Portrait">Portrait</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Nude'} value="Nude">Nude</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Renaissance'} value="Renaissance">Renaissance</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Mannerism'} value="Mannerism">Mannerism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Baroque'} value="Baroque">Baroque</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Romanticism'} value="Romanticism">Romanticism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Academicism'} value="Academicism">Academicism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Classicism'} value="Classicism">Classicism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Realism'} value="Realism">Realism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Cubism'} value="Cubism">Cubism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Symbolism'} value="Symbolism">Symbolism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Abstractionism'} value="Abstractionism">Abstractionism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Surrealism'} value="Surrealism">Surrealism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Modernism'} value="Modernism">Modernism</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Art Deco'} value="Art Deco">Art Deco</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} selected={categStr === 'Art Nouveau'} value="Art Nouveau">Art Nouveau</MenuItem>
        </Select>
  )
}
