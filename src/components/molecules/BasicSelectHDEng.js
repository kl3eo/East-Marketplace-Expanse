import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import TextField from '@mui/material/TextField'
// import Box from '@mui/material/Box'
// import Divider from '@mui/material/Divider'
// import Select from '@mui/material/Select'
// import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { setCateg, setLookup, setLoading, setFullyLoaded, setSomethingLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { useContext, useState } from 'react'
import { store } from '../../../store/store'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { NestedMenuItem } from 'mui-nested-menu'
// import { NestedDropdown } from 'mui-nested-menu'

/* const menuItemsData = {
  label: 'File',
  items: [
    {
      label: 'New',
      callback: (event, item) => console.log('New clicked', event, item)
    },
    {
      label: 'Save',
      callback: (event, item) => console.log('Save clicked', event, item)
    },
    {
      label: 'Save As (300ms delay)',
      delay: 300,
      items: [
        {
          label: 'This way delayed',
          callback: (event, item) => console.log('Save As > Option 1 clicked', event, item)
        },
        {
          label: 'Option 2',
          callback: (event, item) => console.log('Save As > Option 2 clicked', event, item),
          disabled: true
        }
      ]
    },
    {
      label: 'Export',
      items: [
        {
          label: 'File Type 1',
          items: [
            {
              label: 'Option 1',
              callback: (event, item) => console.log('Export > FT1 > O1 clicked', event, item),
              sx: { color: '#FF0000' }
            },
            {
              label: 'Option 2',
              callback: (event, item) => console.log('Export > FT1 > O2 clicked', event, item)
            }
          ]
        },
        {
          label: 'File Type 2',
          callback: (event, item) => console.log('Export > FT2 clicked', event, item)
        }
      ]
    }
  ]
} */
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
      // let city = ''; if (/^city:/.test(categStr)) { const myArr = categStr.split('city:'); city = myArr[1] }
      // if (city.length) { dispatch(setCateg(city)) } else { dispatch(setCateg(e.target.value)) }
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
  /* const handleClose = (e) => {
    dispatch(setCateg('city:' + e.target.value)); setIsCategChangedInMenu(true)
  } */

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
  /* return (
    <NestedDropdown
      menuItemsData={menuItemsData}
      MenuProps={{ elevation: 3 }}
      ButtonProps={{ variant: 'outlined' }}
      onClick={() => console.log('Clicked')}
      style={{ float: 'left', marginRight: '240px' }}
    />
  ) */
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

/* <MenuItem disabled={loading} selected={categStr === 'archive'} onMouseEnter={(e) => setAnchorEl(e.currentTarget)} value='archive'>Archive<Box style={{ position: 'absolute', top: '-60px', left: '-60px' }}><Select style={{ display: 'inline', visibility: 'hidden' }} MenuProps={{ anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, getContentAnchorEl: null }} onChange={handleClose} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}><MenuItem selected={categStr === 'tar.gz'} value='tar.gz'>Tgz</MenuItem><MenuItem selected={categStr === 'zip'} value='zip'>Zip</MenuItem>
</Select></Box></MenuItem> */
