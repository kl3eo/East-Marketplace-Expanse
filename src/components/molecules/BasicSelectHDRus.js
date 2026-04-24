import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { setCateg, setLookup, setLoading, setFullyLoaded, setSomethingLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { useContext, useState } from 'react'
import { store } from '../../../store/store'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { NestedMenuItem } from 'mui-nested-menu'

export default function BasicSelectHDEng ({ disabledBox }) {
  const state = store.getState()
  const storedFilteredItemsList = state.storedFilteredItemsList
  const { categStr, loading } = storedFilteredItemsList
  const [place, setPlace] = React.useState(categStr)
  const { isCategChangedInMenu, setIsCategChangedInMenu } = useContext(NFTModalContext)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    let replaced = false
    setPlace(e.target.getAttribute('datavalue'))
    setTimeout(() => {
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { categStr, lookupStr } = storedFilteredItemsList
      if (categStr.length && !isCategChangedInMenu) { dispatch(setLookup(categStr)); replaced = true }
      dispatch(setCateg(e.target.getAttribute('datavalue')))
      dispatch(getData([]))
      dispatch(setCurrentSlice(0))
      dispatch(setCurrentDisp(0))
      dispatch(setRelo(false))
      dispatch(setLoading(true))
      setTimeout(() => { dispatch(setFullyLoaded(false)); dispatch(setSomethingLoaded(false)) }, 500) // to let existing items disappear before banner rolls out
      if (!lookupStr.length && !replaced) { document.getElementById('searchInput').value = ''; history.replaceState('', '', '/') }
      setIsCategChangedInMenu(true); setMenuPosition(null); document.getElementById('selectItem').value = e.target.getAttribute('datavalue')
    }, 100)
  }

  const [menuPosition, setMenuPosition] = useState(null)
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const handleContextMenu = (event) => {
    event.preventDefault()
    setMenuPosition(menuPosition === null ? { top: event.clientY, left: event.clientX } : null)
    console.log('handle context menu, top', event.clientY, 'left', event.clientX)
  }

  const handleClose = () => {
    setMenuPosition(null)
    setSubMenuOpen(false)
    console.log('handle close')
  }

  return (
    <><TextField id='selectItem' size='small' style={{ width: '160px', lineHeight: '14px', fontSize: '14px', backgroundColor: '#fed', marginRight: '12px' }} onClick={handleContextMenu} onContextMenu={handleContextMenu} value={disabledBox ? '' : place.length ? place : 'Click to Open'}/><Menu open={!!menuPosition} onClose={handleClose} anchorReference='anchorPosition' anchorPosition={menuPosition}>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue=''>All</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Easy'>Easy Token</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Audio'>Audio file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Video'>Video file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Photo'>Photo</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Image'>Image</MenuItem>
          <NestedMenuItem style={{ backgroundColor: '#fed' }} disabled={loading} label='Archive' parentMenuOpen={!!menuPosition} onClick={(e) => { setSubMenuOpen(!subMenuOpen) }}>
            <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} datavalue='archive'>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} datavalue='tar.gz'>Tar.gz</MenuItem>
            <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} datavalue='zip'>Zip</MenuItem>
          </NestedMenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='DOC'>DOC file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='XLS'>XLS file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='PDF'>PDF file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='SVG'>SVG file</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Script'>Scripts</MenuItem>
          <MenuItem style={{ backgroundColor: '#fed' }} onClick={handleChange} disabled={loading} datavalue='Other'>Other</MenuItem>
        </Menu></>
  )
}
