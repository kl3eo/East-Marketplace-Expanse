import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { setCateg, setLookup, setLoading, setFullyLoaded, setSomethingLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { store } from '../../../store/store'
import { useContext, useState } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { NestedMenuItem } from 'mui-nested-menu'

export default function BasicSelectSplitEng ({ disabledBox }) {
  const state = store.getState()
  const storedFilteredItemsList = state.storedFilteredItemsList
  const { categStr, loading } = storedFilteredItemsList
  const [place, setPlace] = React.useState(categStr)
  const { isCategChangedInMenu, setIsCategChangedInMenu } = useContext(NFTModalContext)
  const dispatch = useDispatch()
  const handleChange = (e) => {
    let replaced = false
    setPlace(e.target.getAttribute('datavalue'))
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { categStr, lookupStr } = storedFilteredItemsList
    if (categStr.length && !isCategChangedInMenu) { dispatch(setLookup(categStr)); replaced = true }
    if (e.target.getAttribute('datavalue').length) { dispatch(setCateg(e.target.getAttribute('datavalue'))) } else { if (lookupStr.length) { dispatch(setLookup('')); dispatch(setCateg(lookupStr)) } else { dispatch(setLookup('')); dispatch(setCateg('')) } }
    dispatch(getData([]))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(setRelo(false))
    dispatch(setLoading(true))
    setTimeout(() => { dispatch(setFullyLoaded(false)); dispatch(setSomethingLoaded(false)) }, 500) // to let existing items disappear before banner rolls out
    if (!lookupStr.length && !replaced) { document.getElementById('searchInput').value = ''; history.replaceState('', '', '/') }
    if (e.target.getAttribute('datavalue').length) { setIsCategChangedInMenu(true) } else { setIsCategChangedInMenu(false) }; setMenuPosition(null); document.getElementById('selectItem').value = e.target.getAttribute('datavalue')
  }

  const [menuPosition, setMenuPosition] = useState(null)
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const handleContextMenu = (event) => {
    event.preventDefault(); if (disabledBox) return
    setMenuPosition(menuPosition === null ? { top: event.clientY, left: event.clientX } : null)
    console.log('handle context menu, top', event.clientY, 'left', event.clientX)
  }

  const handleClose = () => {
    setMenuPosition(null)
    setSubMenuOpen(false)
    console.log('handle close')
  }

  return (
    <><TextField id='selectItem' size='small' style={{ width: '180px', lineHeight: '12px', fontSize: '12px', backgroundColor: '#fff', marginRight: '12px' }} onClick={handleContextMenu} onContextMenu={handleContextMenu} value={disabledBox ? '' : place.length ? place : 'Click to Open'} inputProps={{ readOnly: true }}/><Menu open={!!menuPosition} onClose={handleClose} anchorReference='anchorPosition' anchorPosition={menuPosition}>
        <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} disabled={loading} datavalue=''>All</MenuItem>
        <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='America' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Argentina' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Buenos Aires, Argentina'>Buenos Aires</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Chile' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Santiago, Chile'>Santiago</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Cuba' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Cuba'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Habana, Cuba'>Habana</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Varadero, Cuba'>Varadero</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Uruguay' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Montevideo, Uruguay'>Montevideo</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
        <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Asia' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Turkey' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Turkey'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Antalya, Turkey'>Antalya</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
        <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Europe' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Austria' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Vienna, Austria'>Vienna</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Belgium' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Brussels, Belgium'>Brussels</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Cyprus' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Cyprus'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Famagusta, Cyprus'>Famagusta</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Protaras, Cyprus'>Protaras</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Czech' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Czech'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Praha, Czech'>Praha</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Olomouc, Czech'>Olomouc</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Denmark' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Copenhagen, Denmark'>Copenhagen</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='France' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='France'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Paris, France'>Paris</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Carcassonne, France'>Carcassonne</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Germany' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Germany'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Berlin, Germany'>Berlin</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Dusseldorf, Germany'>Dusseldorf</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Leipzig, Germany'>Leipzig</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Munchen, Germany'>Munchen</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Oberstdorf, Germany'>Oberstdorf</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Greece' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Athens, Greece'>Athens</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Hungary' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Hungary'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Balaton, Hungary'>Balaton</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Budapest, Hungary'>Budapest</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Italy' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Italy'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Ostia, Italy'>Ostia</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Rome, Italy'>Rome</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Latvia' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Riga, Latvia'>Riga</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Malta' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Malta'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Buggiba, Malta'>Buggiba</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Mdina, Malta'>Mdina</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Mellieha, Malta'>Mellieha</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Mgarr, Malta'>Mgarr</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Mosta, Malta'>Mosta</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='San Pawl, Malta'>San Pawl</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='St.Julians, Malta'>St. Julian&apos;s</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Tuffieha, Malta'>Tuffieha</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Valetta, Malta'>Valetta</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Poland' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Warsaw, Poland'>Warsaw</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Portugal' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Lisbon, Portugal'>Lisbon</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Slovakia' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Bratislava, Slovakia'>Bratislava</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Spain' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Spain'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Alicante, Spain'>Alicante</MenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Andalucia' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Almeria, Spain'>Almeria</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Carboneras, Spain'>Carboneras</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Ronda, Spain'>Ronda</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Seville, Spain'>Seville</MenuItem>
            </NestedMenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Aragon' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Calatayud, Spain'>Calatayud</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Teruel, Spain'>Teruel</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Zaragoza, Spain'>Zaragoza</MenuItem>
            </NestedMenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Castilla-La Mancha' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Cuenca, Spain'>Cuenca</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Toledo, Spain'>Toledo</MenuItem>
            </NestedMenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Catalunya' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Barcelona, Spain'>Barcelona</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Calella, Spain'>Calella</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Gerona, Spain'>Gerona</MenuItem>
            </NestedMenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Madrid, Spain'>Madrid</MenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Murcia' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='San Pedro del Pinatar, Spain'>S.Pedro d.Pinatar</MenuItem>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Cartagena, Spain'>Cartagena</MenuItem>
            </NestedMenuItem>
            <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Canarias' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
              <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Tenerife, Spain'>Tenerife</MenuItem>
            </NestedMenuItem>
          </NestedMenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fff' }} disabled={loading} label='Turkey' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Turkey'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fff' }} onClick={handleChange} datavalue='Istanbul, Turkey'>Istanbul</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
      </Menu></>
  )
}
