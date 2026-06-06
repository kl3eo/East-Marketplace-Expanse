import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import { useDispatch } from 'react-redux'
import { setCateg, setLookup, setLoading, setFullyLoaded, setSomethingLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { store } from '../../../store/store'
import { useContext } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'

export default function BasicSelectFineArts ({ disabledBox }) {
  const state = store.getState()
  const storedFilteredItemsList = state.storedFilteredItemsList
  const { categStr, loading } = storedFilteredItemsList
  const [place, setPlace] = React.useState(categStr)
  const { isCategChangedInMenu, setIsCategChangedInMenu } = useContext(NFTModalContext)
  const dispatch = useDispatch()
  const handleChange = (e) => {
    let replaced = false
    setPlace(e.target.value)
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { categStr, lookupStr } = storedFilteredItemsList
    if (categStr.length && !isCategChangedInMenu) { dispatch(setLookup(categStr)); replaced = true }
    if (e.target.value.length) { dispatch(setCateg(e.target.value)) } else { if (lookupStr.length) { dispatch(setLookup('')); dispatch(setCateg(lookupStr)) } else { dispatch(setLookup('')); dispatch(setCateg('')) } }
    dispatch(getData([]))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(setRelo(false))
    dispatch(setLoading(true))
    setTimeout(() => { dispatch(setFullyLoaded(false)); console.log('falser 16'); dispatch(setSomethingLoaded(false)) }, 500) // to let existing items disappear before banner rolls out
    if (!lookupStr.length && !replaced) { document.getElementById('searchInput').value = ''; history.replaceState('', '', '/') }
    if (e.target.value.length) { setIsCategChangedInMenu(true) } else { setIsCategChangedInMenu(false) }
  }

  return (
       <Select sx={{ minWidth: 120, backgroundColor: '#fff', marginRight: '8px', height: '40px', display: 'block' }}
          labelId="select-label"
          id="select-id"
          value={disabledBox ? '' : place}
          displayEmpty
          disabled={loading || disabledBox}
          inputProps={{ 'aria-label': 'Without label' }}
          onChange={handleChange}
        >
          <MenuItem value="">Click to Open</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Painting'} value="Painting">Painting</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Drawing'} value="Drawing">Рисунок</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Photo'} value="Photo">Фото</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Genre'} value="Genre">Жанр</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Landscape'} value="Landscape">Пейзаж</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Cityscape'} value="Cityscape">Городской пейзаж</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Seascape'} value="Seascape">Морской пейзаж</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Marine'} value="Marine">Марина</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Portrait'} value="Portrait">Портрет</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Still life'} value="Still life">Натюрморт</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Interior'} value="Interior">Интерьер</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Historic'} value="Historic">История</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Nude'} value="Nude">Ню</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Gothic'} value="Gothic">Готика</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Renaissance'} value="Renaissance">Ренессанс</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Mannerism'} value="Mannerism">Маннеризм</MenuItem>
          <Divider></Divider>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Trecento'} value="Trecento">Треченто</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Quattrocento'} value="Quattrocento">Кватроченто</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Cinquecento'} value="Cinquecento">Чинквеченто</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Netherlandish'} value="Netherlandish">Netherlandish</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Florentine'} value="Florentine">Флорентийская школа</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Venetian'} value="Venetian">Венецианская школа</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Fontainebleau'} value="Fontainebleau">Fontainebleau</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Baroque'} value="Baroque">Барокко</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Classicism'} value="Classicism">Классицизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Golden Age'} value="Golden Age">Золотой век</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Chiaroscuro'} value="Chiaroscuro">Киароскуро</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Tenebrism'} value="Tenebrism">Тенебризм</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Rococo'} value="Rococo">Рококо</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Veduta'} value="Veduta">Ведута</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Neoclassicism'} value="Neoclassicism">Неоклассицизм</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Romanticism'} value="Romanticism">Романтизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Rafaelite'} value="Rafaelite">Прерафаэлиты</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Hudson'} value="Hudson">Гудзон</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Biedermeier'} value="Biedermeier">Бидермайер</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Academicism'} value="Academicism">Академизм</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Realism'} value="Realism">Реализм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Itinerants'} value="Itinerants">Передвижники</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Barbizon'} value="Barbizon">Барбизонская школа</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Ashcan'} value="Ashcan">школа Ашкан</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Barbison'} value="Barbison">American Barbizon</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Luminism'} value="Luminism">Люминизм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Tonalism'} value="Tonalism">Тонализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Symbolism'} value="Symbolism">Символизм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Nouveau'} value="Nouveau">Модерн</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Impressionism'} value="Impressionism">Импрессионизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Newlyn'} value="Newlyn">Ньюлинская школа</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'The Ten'} value="The Ten">The Ten</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Post-impressionism'} value="Post-impressionism">Постимпрессионизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Pont-Aven'} value="Pont-Aven">Понт-Авенская школа</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Les Nabis'} value="Les Nabis">группа Наби</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Divisionism'} value="Divisionism">Неоимпрессионизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Divisionism'} value="Divisionism">Пуантилизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Divisionism'} value="Divisionism">Дивизионизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Fauvism'} value="Fauvism">Фовизм</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Expressionism'} value="Expressionism">Экспрессионизм</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Die Bruecke'} value="Die Bruecke">группа Мост</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Der Blaue Reiter'} value="Der Blaue Reiter">группа Синий Всадник</MenuItem>
          <MenuItem sx={{ fontStyle: 'italic' }} disabled={loading} selected={categStr === 'Sachlichkeit'} value="Sachlichkeit">Новая Объективность</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Precisionism'} value="Precisionism">Прецизионизм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Regionalism'} value="Regionalism">Регионализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Naive'} value="Naive">Наивное</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Folk'} value="Folk">Фолк</MenuItem>
          <Divider></Divider>
          <MenuItem disabled={loading} selected={categStr === 'Cubism'} value="Cubism">Кубизм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Abstractionism'} value="Abstractionism">Абстракционизм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Surreal'} value="Surreal">Сюрреализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Magic'} value="Magic">Магический реализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Art Deco'} value="Art Deco">Art Deco</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Nouveau'} value="Nouveau">Art Nouveau</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Mural'} value="Mural">Мурализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Animalism'} value="Animalism">Анимализм</MenuItem>
          <MenuItem disabled={loading} selected={categStr === 'Travel'} value="Travel">Travel</MenuItem>
        </Select>

  )
}
