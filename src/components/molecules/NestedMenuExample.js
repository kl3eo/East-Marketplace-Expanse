import React, { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { NestedMenuItem } from 'mui-nested-menu'

const NestedMenuExample = () => {
  const [menuPosition, setMenuPosition] = useState(null)
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const handleContextMenu = (event) => {
    event.preventDefault()
    setMenuPosition(menuPosition === null ? { top: event.clientY, left: event.clientX } : null)
  }

  const handleClose = () => {
    setMenuPosition(null)
    setSubMenuOpen(false)
  }

  return (
<div onContextMenu={handleContextMenu} style={{ height: '100vh' }}>
  <p>Right-click to open the menu</p>
  <Menu
    open={!!menuPosition}
    onClose={handleClose}
    anchorReference='anchorPosition'
    anchorPosition={menuPosition}
  >
    <MenuItem onClick={handleClose}>Option 1</MenuItem>
    <NestedMenuItem
      label='Nested Menu'
      parentMenuOpen={!!menuPosition}
      onClick={() => setSubMenuOpen(!subMenuOpen)}
    >
      <MenuItem onClick={handleClose}>Sub Option 1</MenuItem>
      <MenuItem onClick={handleClose}>Sub Option 2</MenuItem>
    </NestedMenuItem>
    <MenuItem onClick={handleClose}>Option 2</MenuItem>
  </Menu>
</div>
  )
}

export default NestedMenuExample
