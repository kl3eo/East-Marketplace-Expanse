import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setCateg, setLoading, setFullyLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { store } from '../../../store/store'

export default function BasicSelectProfiRus () {
  const [selectedList, setSelectedList] = useState([])
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
  // not used now but maybe later
  // <MenuItem
  // onClick={() => handleClick(0)}
  // selected={selectedList.includes(0)}

  const handleClick = (index) => {
    if (selectedList.includes(index)) {
      setSelectedList(
        selectedList.filter(function (value) {
          return value !== index
        }
        )
      )
    } else {
      setSelectedList([...selectedList, index])
    }
  }
  // console.log('rus categStr is', categStr)
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
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(1) } selected={categStr === ''} value="">Все категории</MenuItem>
          <Divider>Онлайнеры</Divider>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(2) } selected={categStr === 'Tutor'} value="Tutor">Репетиторы</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(3) } selected={categStr === 'Psychologist'} value="Psychologist">Психологи</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(4) } selected={categStr === 'Lawyer'} value="Lawyer">Юристы</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(5) } selected={categStr === 'Developer'} value="Developer">Девелоперы</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(6) } selected={categStr === 'Footballer'} value="Footballer">Футболисты</MenuItem>
          <Divider>R-H апарты</Divider>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(7) } selected={categStr === 'Brooklyn'} value="Brooklyn">Brooklyn</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(8) } selected={categStr === 'Manhattan'} value="Manhattan">Manhattan</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(9) } selected={categStr === 'Queens'} value="Queens">Queens</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(10) } selected={categStr === 'Bronx'} value="Bronx">Bronx</MenuItem>
          <Divider>Искусство</Divider>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(11) } selected={categStr === 'Photo'} value="Photo">Фото</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(12) } selected={categStr === 'Genre'} value="Genre">Жанр</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(13) } selected={categStr === 'Scape'} value="Scape">Пейзаж</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(14) } selected={categStr === 'Portrait'} value="Portrait">Портрет</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(15) } selected={categStr === 'Nude'} value="Nude">Nude</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(16) } selected={categStr === 'Renaissance'} value="Renaissance">Ренессанс</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(17) } selected={categStr === 'Mannerism'} value="Mannerism">Маннеризм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(18) } selected={categStr === 'Baroque'} value="Baroque">Барокко</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(19) } selected={categStr === 'Romanticism'} value="Romanticism">Романтизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(20) } selected={categStr === 'Academicism'} value="Academicism">Академизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(21) } selected={categStr === 'Classicism'} value="Classicism">Классицизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(22) } selected={categStr === 'Realism'} value="Realism">Реализм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(23) } selected={categStr === 'Cubism'} value="Cubism">Кубизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(24) } selected={categStr === 'Symbolism'} value="Symbolism">Символизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(25) } selected={categStr === 'Abstractionism'} value="Abstractionism">Абстракционизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(26) } selected={categStr === 'Surrealism'} value="Surrealism">Сюрреализм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(27) } selected={categStr === 'Modernism'} value="Modernism">Модернизм</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(28) } selected={categStr === 'Art Deco'} value="Art Deco">Арт Деко</MenuItem>
          <MenuItem disabled={!fullyLoaded || loading} onClick={ () => handleClick(29) } selected={categStr === 'Art Nouveau'} value="Art Nouveau">Арт Нуво</MenuItem>
        </Select>
  )
}
